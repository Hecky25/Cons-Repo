-- Practice Lab Database Schema
-- Run this in the Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- USERS (extends Supabase auth.users)
-- ─────────────────────────────────────────
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text,
  stripe_customer_id text unique,
  subscription_tier text check (subscription_tier in ('tier1', 'tier2', 'tier3')),
  subscription_status text check (subscription_status in ('active', 'canceled', 'past_due', 'trialing')),
  subscription_period_end timestamptz,
  selected_sport_ids text[] default '{}',
  sports_last_changed_at timestamptz,
  created_at timestamptz default now()
);

-- Auto-create user row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────
-- DRILLS
-- ─────────────────────────────────────────
create table public.drills (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  sport text not null check (sport in ('baseball', 'basketball', 'hockey', 'lacrosse', 'golf')),
  age_groups text[] not null default '{}',
  skill_level text not null check (skill_level in ('beginner', 'intermediate', 'advanced')),
  goal text not null,
  instructions text[] not null default '{}',
  coaching_cues text[] default '{}',
  common_mistakes text[] default '{}',
  equipment text[] default '{}',
  diagram_url text,
  duration_minutes integer not null default 10,
  min_players integer not null default 1,
  max_players integer not null default 20,
  space_needed text,
  variations jsonb default '{"easier":"","harder":""}',
  safety_notes text,
  focus_tags text[] default '{}',
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger drills_updated_at
  before update on public.drills
  for each row execute procedure update_updated_at();

-- ─────────────────────────────────────────
-- DRILL VIEWS (for paywall enforcement)
-- ─────────────────────────────────────────
create table public.drill_views (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  session_id text, -- for anonymous users
  drill_id uuid references public.drills(id) on delete cascade,
  viewed_at timestamptz default now(),
  unique(user_id, drill_id),
  unique(session_id, drill_id)
);

-- ─────────────────────────────────────────
-- FAVORITES
-- ─────────────────────────────────────────
create table public.favorites (
  user_id uuid references public.users(id) on delete cascade,
  drill_id uuid references public.drills(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, drill_id)
);

-- ─────────────────────────────────────────
-- PRACTICE PLANS
-- ─────────────────────────────────────────
create table public.practice_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  duration_minutes integer,
  drill_ids uuid[] default '{}',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger practice_plans_updated_at
  before update on public.practice_plans
  for each row execute procedure update_updated_at();

-- ─────────────────────────────────────────
-- DRILL NOTES (private coach notes)
-- ─────────────────────────────────────────
create table public.drill_notes (
  user_id uuid references public.users(id) on delete cascade,
  drill_id uuid references public.drills(id) on delete cascade,
  note_text text,
  rating integer check (rating between 1 and 5),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (user_id, drill_id)
);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────

alter table public.users enable row level security;
alter table public.drills enable row level security;
alter table public.drill_views enable row level security;
alter table public.favorites enable row level security;
alter table public.practice_plans enable row level security;
alter table public.drill_notes enable row level security;

-- Users: can only read/update their own row
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Drills: published drills are public, unpublished only for service role
create policy "Anyone can view published drills" on public.drills
  for select using (is_published = true);

-- Drill views: users manage their own
create policy "Users manage own views" on public.drill_views
  for all using (auth.uid() = user_id);
create policy "Anonymous views by session" on public.drill_views
  for all using (user_id is null);

-- Favorites: users manage their own
create policy "Users manage own favorites" on public.favorites
  for all using (auth.uid() = user_id);

-- Practice plans: users manage their own
create policy "Users manage own plans" on public.practice_plans
  for all using (auth.uid() = user_id);

-- Drill notes: users manage their own
create policy "Users manage own notes" on public.drill_notes
  for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- SEED: STARTER DRILLS (2 per sport)
-- ─────────────────────────────────────────

insert into public.drills (title, slug, sport, age_groups, skill_level, goal, instructions, coaching_cues, common_mistakes, equipment, duration_minutes, min_players, max_players, space_needed, variations, safety_notes, focus_tags, is_published) values

-- BASEBALL
(
  'Soft Toss Hitting',
  'baseball-soft-toss-hitting',
  'baseball',
  array['5-7','8-10'],
  'beginner',
  'Develop proper swing mechanics and hand-eye coordination',
  array[
    'Set up a tee or have a partner kneel beside the batter at 45 degrees',
    'Partner tosses ball softly into the hitting zone',
    'Batter focuses on keeping eyes on the ball and driving through contact',
    'Follow through completely after each swing',
    'Rotate players every 10 swings'
  ],
  array['Keep your eye on the ball all the way to contact','Step toward the pitcher with your front foot','Stay balanced — do not lunge'],
  array['Dropping the back shoulder','Pulling the head off the ball early','Swinging too hard and losing balance'],
  array['Wiffle balls or tennis balls','Bat','Optional: batting tee'],
  15, 2, 10,
  'Open field or gym with a backstop',
  jsonb_build_object('easier', 'Use a tee instead of toss so the ball is stationary', 'harder', 'Add a target zone on a fence to aim for'),
  'Ensure batter''s box area is clear of other players before each swing',
  array['hitting','hand-eye coordination','fundamentals'],
  true
),
(
  '4-Corner Infield Drill',
  'baseball-4-corner-infield',
  'baseball',
  array['11-13','14-18'],
  'intermediate',
  'Improve fielding, throwing accuracy, and communication across the infield',
  array[
    'Place players at all four bases plus a pitcher''s mound position',
    'Coach hits or rolls a ground ball to one player',
    'Player fields the ball and throws to a designated base',
    'Continue rotating throws around the bases',
    'Rotate positions every 3 minutes'
  ],
  array['Call the ball loudly to avoid collisions','Get in front of ground balls — do not field with your glove only','Transfer ball quickly from glove to throwing hand'],
  array['Not communicating leading to collisions','Throwing off-balance','Lazy footwork to the ball'],
  array['Baseball','Gloves','4 bases','Bat or fungo bat for coach'],
  20, 5, 10,
  'Full infield diamond',
  jsonb_build_object('easier', 'Use rolled ground balls instead of hit balls', 'harder', 'Add a runner to create game-speed pressure'),
  'Batters and fielders must be aware of the ball at all times. Wear helmets if live hitting is used.',
  array['fielding','throwing','communication','infield'],
  true
),

-- BASKETBALL
(
  'Mikan Drill',
  'basketball-mikan-drill',
  'basketball',
  array['8-10','11-13'],
  'beginner',
  'Develop finishing around the basket with both hands',
  array[
    'Start under the basket on the right block',
    'Power up for a right-hand layup off the backboard',
    'Catch the ball before it hits the floor',
    'Step across to the left block and finish with the left hand',
    'Repeat continuously for 30–60 seconds'
  ],
  array['Use the backboard — aim for the top corner of the box','Jump off the correct foot for each side (right layup = left foot takeoff)','Stay close to the basket'],
  array['Jumping off the wrong foot','Not using the backboard','Letting the ball bounce before catching it'],
  array['Basketball','Hoop'],
  10, 1, 4,
  'Half court — one basket',
  jsonb_build_object('easier', 'Allow the ball to bounce once before catching', 'harder', 'Add a defender applying light pressure'),
  'Ensure players are not colliding under the basket when running this in groups',
  array['finishing','layups','footwork','both hands'],
  true
),
(
  '3-Man Weave',
  'basketball-3-man-weave',
  'basketball',
  array['11-13','14-18','adult'],
  'intermediate',
  'Develop passing, timing, and transition offense as a unit',
  array[
    'Three players line up across the baseline — one in center, one on each wing',
    'Center passes to either wing and runs behind that player',
    'Wing passes to the opposite player and runs behind them',
    'Continue weaving up the court and finish with a layup',
    'Rotate to the back of lines after each rep'
  ],
  array['Pass ahead — do not wait for the receiver to stop','Run behind the player you passed to','The shooter stays for their own rebound'],
  array['Passing too late','Running in front instead of behind','Slowing down to watch the pass'],
  array['Basketball','Full court'],
  15, 3, 12,
  'Full court',
  jsonb_build_object('easier', 'Walk through the pattern before adding speed', 'harder', 'Add a 4th player as a trailing defender'),
  'Players should call out when they have the ball to avoid collisions at speed',
  array['passing','transition','teamwork','layups'],
  true
),

-- HOCKEY
(
  'Figure-8 Stickhandling',
  'hockey-figure-8-stickhandling',
  'hockey',
  array['8-10','11-13'],
  'beginner',
  'Build puck control and stickhandling fluidity with both forehand and backhand',
  array[
    'Set up two pylons 3 feet apart',
    'Player starts on one side and stickhandles the puck in a figure-8 pattern around both pylons',
    'Focus on soft hands — controlling the puck, not slapping it',
    'Complete 10 circuits then switch direction',
    'Gradually increase speed while maintaining control'
  ],
  array['Keep your eyes up — feel the puck, don''t look at it','Cup the puck with the blade — don''t let it get away from your body','Bend your knees and stay low'],
  array['Stiff wrists causing jerky movement','Looking down at the puck the entire time','Standing straight up'],
  array['Hockey stick','Puck','2 pylons'],
  10, 1, 8,
  'Small section of ice or dryland surface',
  jsonb_build_object('easier', 'Use a larger ball on dryland before progressing to a puck on ice', 'harder', 'Increase pylon spacing and add a third pylon'),
  'Ensure adequate spacing between players doing this drill simultaneously',
  array['stickhandling','puck control','hands'],
  true
),
(
  '2-on-1 Rush',
  'hockey-2-on-1-rush',
  'hockey',
  array['11-13','14-18','adult'],
  'intermediate',
  'Teach offensive zone decision-making and defensive positioning in transition',
  array[
    'Two forwards start at center ice, one defenseman starts near the blue line defending',
    'Coach sends the puck to start the rush',
    'Forwards work together — pass or shoot based on what the defender gives them',
    'Defender must angle off the puck carrier and take away the pass lane',
    'Rotate after each rep: left forward becomes defender'
  ],
  array['Offense: make the defender commit before passing','Defender: stay between the puck and the net — do not over-commit','Shooter: pick a corner early and commit'],
  array['Defender pinching too early and getting beat','Puck carrier holding too long','Not shooting when the lane is open'],
  array['Pucks','Full ice or half ice','Goalie (optional)'],
  20, 3, 18,
  'Full ice — one end',
  jsonb_build_object('easier', 'Slow the rush down — have forwards walk it in slowly', 'harder', 'Add a second defender for a 2-on-2'),
  'Defenders should avoid body contact drills until proper technique is taught. Use verbal cues only in early skill stages.',
  array['transition','offense','defense','decision making'],
  true
),

-- LACROSSE
(
  'Wall Ball',
  'lacrosse-wall-ball',
  'lacrosse',
  array['8-10','11-13','14-18'],
  'beginner',
  'Build catching and throwing consistency with both dominant and weak hand',
  array[
    'Stand 10–15 feet from a solid wall',
    'Throw the ball against the wall with your dominant hand',
    'Catch the return with the same hand',
    'Complete 25 reps on dominant hand then switch to weak hand',
    'Focus on soft cradles when catching — absorb the ball into your stick'
  ],
  array['Step toward the wall with your opposite foot when throwing','Keep your top hand loose — grip tighter only at release','Cradle through the catch to protect the ball'],
  array['Throwing with all arm and no body rotation','Catching with a stiff stick — no give','Standing flat-footed'],
  array['Lacrosse stick','Lacrosse ball','Solid wall'],
  15, 1, 1,
  'Any wall — parking lot, gym wall, brick wall',
  jsonb_build_object('easier', 'Move closer to the wall (5-8 feet) and use a softer toss', 'harder', 'Alternate hands on every throw without stopping'),
  'Use appropriate balls for age — soft rubber balls for younger players',
  array['catching','throwing','fundamentals','weak hand'],
  true
),
(
  'Ground Ball Box Drill',
  'lacrosse-ground-ball-box',
  'lacrosse',
  array['11-13','14-18','adult'],
  'intermediate',
  'Improve ground ball technique, scooping under pressure, and outlet passing',
  array[
    'Set up a 5x5 yard box with 4 pylons',
    'Coach rolls a ground ball into the box',
    'Two players compete for the ground ball',
    'Player who scoops it must protect the ball and complete an outlet pass to coach',
    'Rotate players every rep'
  ],
  array['Get your body low and scoop through the ball — do not stop at it','Use your body to box out the opponent legally','Cradle quickly after scooping to protect possession'],
  array['Reaching instead of going through the ball','Standing upright when scooping','Not protecting the ball after gaining possession'],
  array['Lacrosse sticks','Lacrosse balls','4 pylons'],
  15, 3, 12,
  'Small open area — 10x10 yards minimum',
  jsonb_build_object('easier', 'Remove the opponent — scoop uncontested first', 'harder', 'Add a second ball so both players must scoop and pass simultaneously'),
  'Teach and enforce legal body contact rules before introducing competition in this drill',
  array['ground balls','physicality','scooping','possession'],
  true
),

-- GOLF
(
  'Gate Putting Drill',
  'golf-gate-putting-drill',
  'golf',
  array['5-7','8-10','11-13','14-18','adult'],
  'beginner',
  'Develop consistent putter face alignment and a straight putting stroke',
  array[
    'Place two tees in the green just wider than the putter head, about 6 inches in front of the ball',
    'Address the ball normally',
    'Make your putting stroke through the gate (the two tees) without touching either tee',
    'Start with a 3-foot putt and focus only on the stroke — not the hole',
    'Once consistent, gradually increase putt length'
  ],
  array['Keep your eyes over the ball at address','Let your shoulders rock — do not use your wrists','Accelerate through the ball — do not decelerate at impact'],
  array['Flipping the wrists through impact','Decelerating before contact','Looking up before the ball is struck'],
  array['Putter','Golf balls','2 tees','Putting green or flat surface'],
  10, 1, 4,
  'Putting green or any flat surface',
  jsonb_build_object('easier', 'Widen the gate so there is more room for error', 'harder', 'Narrow the gate to putter-head width for a tighter challenge'),
  'Ensure area around the green is clear before players begin putting',
  array['putting','alignment','stroke','short game'],
  true
),
(
  '9-Ball Chipping Game',
  'golf-9-ball-chipping-game',
  'golf',
  array['8-10','11-13','14-18','adult'],
  'intermediate',
  'Improve short game consistency and introduce competitive pressure in chipping',
  array[
    'Place 3 balls each at 3 different distances from the hole (5, 10, and 15 yards)',
    'Chip all 9 balls trying to get each as close to the hole as possible',
    'Score 3 pts if the ball goes in, 2 pts if inside 3 feet, 1 pt if inside 6 feet',
    'Track your score and try to beat it each round',
    'Switch clubs to practice different trajectories'
  ],
  array['Hands ahead of the ball at impact — lean the shaft toward the target','Pick a landing spot on the green, not the hole itself','Use less loft when possible — less air time means more predictable roll'],
  array['Scooping under the ball instead of hitting down','Aiming at the hole instead of a landing spot','Using a wedge when a 9-iron would be more controlled'],
  array['Wedge and/or 9-iron','Golf balls','Hole or target on a green'],
  20, 1, 4,
  'Chipping green or rough area near a green',
  jsonb_build_object('easier', 'Move all balls to 5 yards and focus on one distance first', 'harder', 'Add penalty points if the ball goes past 6 feet long'),
  'Ensure all players are behind the hitting area before anyone chips',
  array['chipping','short game','competition','pressure'],
  true
);
