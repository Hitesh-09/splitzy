-- ==============================================================================
-- Migration: 001_initial_schema.sql
-- Description: Core schema for Splitzy (Profiles, Groups, Expenses, Splits, Settlements, Payments, RLS)
-- ==============================================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Profiles Table
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    display_name text not null,
    avatar_url text,
    upi_vpa text,
    phone text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Trigger to auto-create profile on auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, display_name, avatar_url)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url'
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. Groups Table
-- ------------------------------------------------------------------------------
create table if not exists public.groups (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    created_by uuid not null references public.profiles(id),
    currency text not null default 'INR' check (currency ~ '^[A-Z]{3}$'),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 3. Group Members Table
-- ------------------------------------------------------------------------------
create table if not exists public.group_members (
    group_id uuid not null references public.groups(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    role text not null default 'member' check (role in ('owner', 'admin', 'member')),
    status text not null default 'active' check (status in ('invited', 'active', 'left')),
    joined_at timestamptz not null default now(),
    primary key (group_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 4. Expenses Table
-- ------------------------------------------------------------------------------
create table if not exists public.expenses (
    id uuid primary key default gen_random_uuid(),
    group_id uuid not null references public.groups(id) on delete cascade,
    paid_by uuid not null,
    created_by uuid not null references public.profiles(id),
    description text not null,
    category text not null default 'miscellaneous' check (
        category in ('rent', 'groceries', 'electricity', 'wifi', 'maid', 'water', 'food', 'travel', 'miscellaneous')
    ),
    amount_paise bigint not null check (amount_paise > 0),
    split_type text not null default 'equal' check (
        split_type in ('equal', 'exact', 'percentage', 'shares')
    ),
    receipt_url text,
    occurred_at timestamptz not null default now(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz,
    unique (id, group_id),
    foreign key (group_id, paid_by) references public.group_members(group_id, user_id),
    foreign key (group_id, created_by) references public.group_members(group_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 5. Expense Splits Table
-- ------------------------------------------------------------------------------
create table if not exists public.expense_splits (
    expense_id uuid not null,
    group_id uuid not null,
    user_id uuid not null,
    share_paise bigint not null check (share_paise >= 0),
    primary key (expense_id, user_id),
    foreign key (expense_id, group_id) references public.expenses(id, group_id) on delete cascade,
    foreign key (group_id, user_id) references public.group_members(group_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 6. Settlements Table
-- ------------------------------------------------------------------------------
create table if not exists public.settlements (
    id uuid primary key default gen_random_uuid(),
    group_id uuid not null references public.groups(id) on delete cascade,
    from_user uuid not null,
    to_user uuid not null,
    amount_paise bigint not null check (amount_paise > 0),
    status text not null default 'pending' check (
        status in ('pending', 'processing', 'completed', 'failed', 'cancelled')
    ),
    notes text,
    created_at timestamptz not null default now(),
    completed_at timestamptz,
    check (from_user <> to_user),
    foreign key (group_id, from_user) references public.group_members(group_id, user_id),
    foreign key (group_id, to_user) references public.group_members(group_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 7. Payment Attempts Table
-- ------------------------------------------------------------------------------
create table if not exists public.payment_attempts (
    id uuid primary key default gen_random_uuid(),
    settlement_id uuid not null references public.settlements(id) on delete cascade,
    provider text not null check (provider in ('upi_intent', 'razorpay', 'cashfree', 'manual')),
    provider_payment_id text,
    status text not null default 'created' check (
        status in ('created', 'pending', 'succeeded', 'failed', 'expired')
    ),
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 8. Audit Logs Table
-- ------------------------------------------------------------------------------
create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid(),
    group_id uuid references public.groups(id) on delete cascade,
    actor_id uuid references public.profiles(id),
    action text not null,
    entity_type text not null,
    entity_id uuid not null,
    payload jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 9. Indexes for Performance
-- ------------------------------------------------------------------------------
create index if not exists idx_expenses_group_date 
    on public.expenses(group_id, occurred_at desc) 
    where deleted_at is null;

create index if not exists idx_expense_splits_user 
    on public.expense_splits(user_id, expense_id);

create index if not exists idx_settlements_group_status 
    on public.settlements(group_id, status);

create index if not exists idx_group_members_user 
    on public.group_members(user_id, status);

create unique index if not exists idx_payment_provider_ref 
    on public.payment_attempts(provider, provider_payment_id) 
    where provider_payment_id is not null;

-- ------------------------------------------------------------------------------
-- 10. Row Level Security (RLS)
-- ------------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.expenses enable row level security;
alter table public.expense_splits enable row level security;
alter table public.settlements enable row level security;
alter table public.payment_attempts enable row level security;
alter table public.audit_logs enable row level security;

-- Helper function to check if current user is an active member of group
create or replace function public.is_group_member(p_group_id uuid)
returns boolean as $$
    select exists (
        select 1 from public.group_members
        where group_id = p_group_id
          and user_id = auth.uid()
          and status = 'active'
    );
$$ language sql security definer stable;

-- Profiles Policies:
-- Users can read their own profile, or profiles of users in groups they share
create policy "Users can view profile if authenticated"
    on public.profiles for select
    to authenticated
    using (true);

create policy "Users can update their own profile"
    on public.profiles for update
    to authenticated
    using (auth.uid() = id);

-- Groups Policies:
create policy "Members can view their groups"
    on public.groups for select
    to authenticated
    using (public.is_group_member(id));

create policy "Authenticated users can create groups"
    on public.groups for insert
    to authenticated
    with check (auth.uid() = created_by);

create policy "Group admins/owners can update groups"
    on public.groups for update
    to authenticated
    using (
        exists (
            select 1 from public.group_members
            where group_id = id
              and user_id = auth.uid()
              and role in ('owner', 'admin')
        )
    );

-- Group Members Policies:
create policy "Members can view group membership"
    on public.group_members for select
    to authenticated
    using (public.is_group_member(group_id));

create policy "Group owners can add members"
    on public.group_members for insert
    to authenticated
    with check (
        public.is_group_member(group_id) or user_id = auth.uid()
    );

-- Expenses Policies:
create policy "Members can view expenses"
    on public.expenses for select
    to authenticated
    using (public.is_group_member(group_id) and deleted_at is null);

create policy "Members can add expenses"
    on public.expenses for insert
    to authenticated
    with check (public.is_group_member(group_id) and created_by = auth.uid());

create policy "Expense creator or payer can edit expenses"
    on public.expenses for update
    to authenticated
    using (public.is_group_member(group_id) and (created_by = auth.uid() or paid_by = auth.uid()));

-- Expense Splits Policies:
create policy "Members can view splits"
    on public.expense_splits for select
    to authenticated
    using (public.is_group_member(group_id));

create policy "Members can add splits"
    on public.expense_splits for insert
    to authenticated
    with check (public.is_group_member(group_id));

-- Settlements Policies:
create policy "Members can view settlements"
    on public.settlements for select
    to authenticated
    using (public.is_group_member(group_id));

create policy "Members can create settlements"
    on public.settlements for insert
    to authenticated
    with check (public.is_group_member(group_id) and from_user = auth.uid());

create policy "Participants can update settlements"
    on public.settlements for update
    to authenticated
    using (public.is_group_member(group_id) and (from_user = auth.uid() or to_user = auth.uid()));
