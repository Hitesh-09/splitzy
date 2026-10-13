-- ==============================================================================
-- Seed: seed.sql
-- Description: Test data for Flat of 6 members with initial expenses
-- ==============================================================================

-- Mock User Profiles
-- (In Supabase Auth, these UUIDs would correspond to auth.users ids)
insert into public.profiles (id, display_name, upi_vpa, phone) values
    ('11111111-1111-1111-1111-111111111111', 'Hitesh Shimpi', 'hitesh@okhdfcbank', '+919876543210'),
    ('22222222-2222-2222-2222-222222222222', 'Aarav Sharma', 'aarav@okaxis', '+919876543211'),
    ('33333333-3333-3333-3333-333333333333', 'Rohan Verma', 'rohan@icici', '+919876543212'),
    ('44444444-4444-4444-4444-444444444444', 'Kabir Mehta', 'kabir@paytm', '+919876543213'),
    ('55555555-5555-5555-5555-555555555555', 'Siddharth Rao', 'sid@ybl', '+919876543214'),
    ('66666666-6666-6666-6666-666666666666', 'Dev Patel', 'dev@oksbi', '+919876543215')
on conflict (id) do update set
    display_name = excluded.display_name,
    upi_vpa = excluded.upi_vpa;

-- Flat Group
insert into public.groups (id, name, description, created_by, currency) values
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Flat 402 Squad', 'Expenses for our flat of 6 members', '11111111-1111-1111-1111-111111111111', 'INR')
on conflict (id) do nothing;

-- Add 6 flatmates to the group
insert into public.group_members (group_id, user_id, role, status) values
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner', 'active'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'admin', 'active'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'member', 'active'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'member', 'active'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'member', 'active'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666', 'member', 'active')
on conflict (group_id, user_id) do nothing;

-- Sample Expense: Groceries ₹1,200 (120,000 paise) paid by Hitesh, split equally among all 6 members (₹200 / 20,000 paise each)
insert into public.expenses (id, group_id, paid_by, created_by, description, category, amount_paise, split_type) values
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Blinkit weekly groceries & snacks', 'groceries', 120000, 'equal')
on conflict (id) do nothing;

insert into public.expense_splits (expense_id, group_id, user_id, share_paise) values
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 20000),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 20000),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 20000),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 20000),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 20000),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666', 20000)
on conflict (expense_id, user_id) do nothing;

-- Sample Expense 2: Wi-Fi bill ₹999 (99,900 paise) paid by Aarav, split equally (16,650 paise each)
insert into public.expenses (id, group_id, paid_by, created_by, description, category, amount_paise, split_type) values
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Airtel Xstream Fiber Broadband', 'wifi', 99900, 'equal')
on conflict (id) do nothing;

insert into public.expense_splits (expense_id, group_id, user_id, share_paise) values
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 16650),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 16650),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 16650),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 16650),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 16650),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666', 16650)
on conflict (expense_id, user_id) do nothing;
