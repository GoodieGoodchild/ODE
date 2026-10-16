-- ============================================================
-- ODE — Open Dining Experiences
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Profiles (extends auth.users) ───────────────────────────
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  role text check (role in ('diner', 'restaurant', 'brand')) not null,
  avatar_url text,
  passions text[] default '{}',
  created_at timestamptz default now()
);

-- ── Restaurants ──────────────────────────────────────────────
create table if not exists restaurants (
  id bigserial primary key,
  owner_id uuid references profiles(id) on delete set null,
  name text not null,
  cuisine text,
  location text,
  description text,
  image_url text default 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  price_range text default '$$$',
  rating numeric(3,1) default 4.5,
  review_count int default 0,
  open_tables int default 0,
  created_at timestamptz default now()
);

-- ── Brands ───────────────────────────────────────────────────
create table if not exists brands (
  id bigserial primary key,
  owner_id uuid references profiles(id) on delete set null,
  name text not null,
  category text,
  logo text default '🍷',
  budget numeric(12,2) default 0,
  spent numeric(12,2) default 0,
  created_at timestamptz default now()
);

-- ── Experiences ───────────────────────────────────────────────
create table if not exists experiences (
  id bigserial primary key,
  restaurant_id bigint references restaurants(id) on delete cascade,
  name text not null,
  description text,
  price_per_person numeric(10,2) not null,
  seats int not null default 4,
  seats_filled int not null default 0,  -- updated by trigger on bookings
  privacy text check (privacy in ('Open', 'Closed')) default 'Open',
  allow_table_drinks boolean not null default true, -- restaurant can disable for fine dining
  date date not null,
  time time not null,
  days_to_fill int,
  created_at timestamptz default now()
);

-- ── Experience Courses ────────────────────────────────────────
create table if not exists experience_courses (
  id bigserial primary key,
  experience_id bigint references experiences(id) on delete cascade,
  course_type text check (course_type in ('starter', 'main', 'palate', 'dessert')) not null,
  item_name text not null
);

-- ── Promotions ────────────────────────────────────────────────
create table if not exists promotions (
  id bigserial primary key,
  brand_id bigint references brands(id) on delete cascade,
  name text not null,
  description text,
  type text check (type in ('wine', 'spirits', 'beer', 'sparkling', 'other')) default 'wine',
  tag text,
  discount text,
  original_price numeric(10,2) default 0,
  promo_price numeric(10,2) default 0,
  color text default 'green',
  expires_at date not null,
  created_at timestamptz default now()
);

-- ── Experience ↔ Promotions (junction) ────────────────────────
create table if not exists experience_promotions (
  experience_id bigint references experiences(id) on delete cascade,
  promotion_id bigint references promotions(id) on delete cascade,
  primary key (experience_id, promotion_id)
);

-- ── Bookings ──────────────────────────────────────────────────
create table if not exists bookings (
  id bigserial primary key,
  diner_id uuid references profiles(id) on delete set null,
  experience_id bigint references experiences(id) on delete set null,
  seats int not null default 1,
  total_amount numeric(10,2) not null default 0,
  status text check (status in ('pending', 'confirmed', 'cancelled')) default 'confirmed',
  accept_table_drinks boolean not null default true, -- diner opt-out of surprise drinks
  created_at timestamptz default now()
);

-- ── Table Drinks ──────────────────────────────────────────────
-- Drinks that diners pre-purchase for the whole table.
-- Shown to other diners as social proof before they book.
create table if not exists table_drinks (
  id bigserial primary key,
  experience_id bigint references experiences(id) on delete cascade,
  diner_id uuid references profiles(id) on delete set null,
  diner_name text not null,             -- cached first name for display
  item_id text not null,                -- key from TABLE_DRINK_CATALOG
  item_name text not null,
  item_emoji text not null,
  item_category text not null,
  price integer not null default 0,     -- in ZAR, 0 = complimentary/TBD
  message text,                         -- optional note e.g. "Enjoy the night! 🥂"
  created_at timestamptz default now()
);

-- ── Booking ↔ Promotions (junction) ──────────────────────────
create table if not exists booking_promotions (
  booking_id bigint references bookings(id) on delete cascade,
  promotion_id bigint references promotions(id) on delete cascade,
  primary key (booking_id, promotion_id)
);

-- ── Open Tables ───────────────────────────────────────────────
create table if not exists open_tables (
  id bigserial primary key,
  experience_id bigint references experiences(id) on delete cascade,
  host_id uuid references profiles(id) on delete set null,
  description text,
  seats_total int not null default 4,
  seats_filled int not null default 1,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table profiles enable row level security;
alter table restaurants enable row level security;
alter table brands enable row level security;
alter table experiences enable row level security;
alter table experience_courses enable row level security;
alter table promotions enable row level security;
alter table experience_promotions enable row level security;
alter table bookings enable row level security;
alter table booking_promotions enable row level security;
alter table open_tables enable row level security;

-- Profiles: users can read all, only update their own
create policy "profiles_select_all" on profiles for select using (true);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- Restaurants: anyone can read, only owner can write
create policy "restaurants_select_all" on restaurants for select using (true);
create policy "restaurants_insert_owner" on restaurants for insert with check (auth.uid() = owner_id);
create policy "restaurants_update_owner" on restaurants for update using (auth.uid() = owner_id);

-- Brands: anyone can read, only owner can write
create policy "brands_select_all" on brands for select using (true);
create policy "brands_insert_owner" on brands for insert with check (auth.uid() = owner_id);
create policy "brands_update_owner" on brands for update using (auth.uid() = owner_id);

-- Experiences: anyone can read, restaurant owner can write
create policy "experiences_select_all" on experiences for select using (true);
create policy "experiences_insert_auth" on experiences for insert with check (auth.uid() is not null);
create policy "experiences_update_auth" on experiences for update using (auth.uid() is not null);

-- Courses: public read
create policy "courses_select_all" on experience_courses for select using (true);
create policy "courses_insert_auth" on experience_courses for insert with check (auth.uid() is not null);

-- Promotions: public read, brand owner writes
create policy "promotions_select_all" on promotions for select using (true);
create policy "promotions_insert_auth" on promotions for insert with check (auth.uid() is not null);

-- Experience promotions: public read
create policy "exp_promos_select_all" on experience_promotions for select using (true);
create policy "exp_promos_insert_auth" on experience_promotions for insert with check (auth.uid() is not null);

-- Bookings: diner sees own, restaurant sees theirs via join
create policy "bookings_select_own" on bookings for select using (auth.uid() = diner_id);
create policy "bookings_insert_auth" on bookings for insert with check (auth.uid() = diner_id);

-- Booking promotions
create policy "booking_promos_select_own" on booking_promotions for select using (true);
create policy "booking_promos_insert_auth" on booking_promotions for insert with check (auth.uid() is not null);

-- Open tables: public read
create policy "open_tables_select_all" on open_tables for select using (true);
create policy "open_tables_insert_auth" on open_tables for insert with check (auth.uid() is not null);

-- Table drinks: anyone can read, authenticated diners can insert
alter table table_drinks enable row level security;
create policy "table_drinks_select_all" on table_drinks for select using (true);
create policy "table_drinks_insert_auth" on table_drinks for insert with check (auth.uid() = diner_id);
create policy "table_drinks_delete_own" on table_drinks for delete using (auth.uid() = diner_id);

-- ============================================================
-- Trigger: keep experiences.seats_filled in sync with bookings
-- ============================================================
create or replace function sync_seats_filled()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'INSERT' and NEW.status = 'confirmed' then
    update experiences
    set seats_filled = seats_filled + NEW.seats
    where id = NEW.experience_id;
  elsif TG_OP = 'UPDATE' then
    -- status changed to cancelled → subtract
    if OLD.status = 'confirmed' and NEW.status = 'cancelled' then
      update experiences
      set seats_filled = greatest(0, seats_filled - OLD.seats)
      where id = NEW.experience_id;
    end if;
    -- status changed to confirmed → add
    if OLD.status != 'confirmed' and NEW.status = 'confirmed' then
      update experiences
      set seats_filled = seats_filled + NEW.seats
      where id = NEW.experience_id;
    end if;
  elsif TG_OP = 'DELETE' and OLD.status = 'confirmed' then
    update experiences
    set seats_filled = greatest(0, seats_filled - OLD.seats)
    where id = OLD.experience_id;
  end if;
  return coalesce(NEW, OLD);
end;
$$;

create trigger trg_sync_seats_filled
after insert or update or delete on bookings
for each row execute function sync_seats_filled();

-- ============================================================
-- Auto-create profile on signup (trigger)
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'diner')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- API Quota Tracking
-- Tracks monthly usage of paid external APIs to enforce our
-- self-imposed caps before Google (or anyone else) charges us.
-- ============================================================

create table if not exists api_quota (
  id         bigserial primary key,
  service    text not null,          -- e.g. 'google_places'
  month      text not null,          -- e.g. '2026-06' (YYYY-MM)
  count      integer not null default 0,
  updated_at timestamptz default now(),
  unique (service, month)
);

-- RLS: only service-role (server) can write; anon can read own service counts
alter table api_quota enable row level security;
create policy "anon can read quota" on api_quota for select using (true);
create policy "service role can upsert quota" on api_quota for all using (true);

-- Atomic increment via RPC (avoids race conditions with concurrent requests)
create or replace function increment_api_quota(p_service text, p_month text)
returns void language plpgsql security definer as $$
begin
  insert into api_quota (service, month, count, updated_at)
  values (p_service, p_month, 1, now())
  on conflict (service, month)
  do update set count = api_quota.count + 1, updated_at = now();
end;
$$;

-- ============================================================
-- Seed Data — sample restaurants, experiences & promotions
-- ============================================================

insert into restaurants (name, cuisine, location, description, image_url, price_range, rating, review_count, open_tables) values
  ('Fohlio', 'Contemporary African', 'Cape Town, Waterfront', 'Where African heritage meets modern gastronomy.', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', '$$$$', 4.7, 312, 3),
  ('Piazaroni', 'Italian Modern', 'Johannesburg, Sandton', 'Modern Italian dining with a South African soul.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', '$$$', 4.5, 218, 5),
  ('The Garden Table', 'Farm-to-Table', 'Stellenbosch, Winelands', 'Grown on-site, cooked with love.', 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80', '$$$', 4.8, 184, 2),
  ('Harbour & Flame', 'Seafood & Grill', 'Durban, Point', 'Ocean-fresh catches meet open-flame cooking.', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', '$$$', 4.4, 267, 7)
on conflict do nothing;

insert into experiences (restaurant_id, name, description, price_per_person, seats, privacy, date, time, days_to_fill) values
  (1, '2 Course Menu', 'A carefully curated two-course journey', 480, 4, 'Open', current_date + 11, '19:30', 12),
  (1, '3 Course Menu', 'The full Fohlio experience — starter, main, dessert', 680, 6, 'Open', current_date + 13, '19:00', 14),
  (1, 'Tasting Menu', 'Our signature 5-course tasting journey with optional pairings', 950, 4, 'Closed', current_date + 20, '19:30', 21),
  (2, 'Pasta & Wine Evening', 'Hand-rolled pasta paired with Italian wine selection', 520, 6, 'Open', current_date + 16, '18:30', 17)
on conflict do nothing;

insert into experience_courses (experience_id, course_type, item_name) values
  (1, 'starter', 'Grilled Cheese Fingers'),
  (1, 'starter', 'Tapas Alla Arribeanos'),
  (1, 'main', 'Steak & Potatoes'),
  (1, 'main', 'Mushroom Risotto'),
  (2, 'starter', 'Grilled Cheese Fingers'),
  (2, 'main', 'Steak & Potatoes'),
  (2, 'main', 'Chicken Alla King'),
  (2, 'dessert', 'Chocolate Ice-Cream'),
  (2, 'dessert', 'Caramel Twirls'),
  (3, 'starter', 'Table Bread with Lemon Jam'),
  (3, 'starter', 'Tapiered Schnitzel in a Parsnip Fillet'),
  (3, 'main', 'Forest Mushroom Risotto'),
  (3, 'palate', 'Lemon Sorbet'),
  (3, 'dessert', 'Lemon Tart & Dark Berry'),
  (4, 'starter', 'Bruschetta Trio'),
  (4, 'starter', 'Burrata & Heirloom Tomato'),
  (4, 'main', 'Pappardelle Bolognese'),
  (4, 'main', 'Cacio e Pepe'),
  (4, 'dessert', 'Tiramisu')
on conflict do nothing;
