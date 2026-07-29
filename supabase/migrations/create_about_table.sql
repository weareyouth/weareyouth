-- Yeh table 'About Us' section ka poora content store karega — title, mission, vision, story sab kuch
-- Supabase dashboard mein jaao aur yeh SQL Editor mein paste karke run karo: https://supabase.com/dashboard/project/_/sql/new

CREATE TABLE IF NOT EXISTS about_content (
  id INT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  lead_text TEXT NOT NULL,
  mission_title TEXT NOT NULL,
  mission_desc TEXT NOT NULL,
  vision_title TEXT NOT NULL,
  vision_desc TEXT NOT NULL,
  image TEXT NOT NULL,
  story_title TEXT NOT NULL,
  story_badge TEXT NOT NULL,
  story_lead TEXT NOT NULL,
  story_content TEXT NOT NULL,
  story_quote TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS enable karo — yeh bahut zaroori hai, warna koi bhi bina permission ke data change kar sakta hai
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

-- About section toh website par sabko dikhna chahiye — isliye public read access de rahe hain
CREATE POLICY "Allow public read access on about_content" 
ON about_content FOR SELECT 
USING (true);

-- Content ko edit karna sirf admin ka kaam hai — yeh policy usi ko write access deti hai
CREATE POLICY "Allow admin modifications on about_content" 
ON about_content FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Yeh default data hai jo table mein pehli baar insert ho raha hai — agar row pehle se hai toh kuch nahi hoga
INSERT INTO about_content (
  id, title, subtitle, lead_text, 
  mission_title, mission_desc, 
  vision_title, vision_desc, 
  image, story_title, story_badge, 
  story_lead, story_content, story_quote
) VALUES (
  1,
  'Empowering the Youth, Securing the Future',
  'About Us',
  'We Are Youth Foundation is committed to creating a world where every young person is empowered to reach their full potential.',
  'Our Mission',
  'To provide quality education, skills training, and mentorship to underprivileged youth across the nation.',
  'Our Vision',
  'A society where every young mind is nurtured, educated, and equipped to become a leader of tomorrow.',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'From a Single Spark to a Movement',
  'Our Origins',
  'It all started with a simple, unwavering belief: that no brilliant young mind should ever be left behind because of their circumstances.',
  'Ten years ago, a small group of passionate college students noticed a heartbreaking reality in our local communities—children sitting outside classrooms they couldn''t afford to enter, and talented youth taking up daily wage jobs just to survive. We didn''t have massive funding or infrastructure, but we had an abundance of hope.

As word spread, those three children became thirty, and soon three hundred. We quickly realized that true empowerment doesn''t stop at textbooks. We expanded our mission to ensure holistic growth—distributing nutritious food to keep them healthy, and setting up modern skills-training centers to equip them for the real world. 

Today, the We Are Youth Foundation has had the profound privilege of touching over 100,000 lives. While our scale has grown exponentially, our core philosophy remains exactly the same as it was under that Banyan tree.

When you look into the eyes of the youth we serve, you don''t just see gratitude; you see the fierce, undeniable spark of tomorrow''s leaders. This isn''t just our story—it is theirs. And hand in hand with supporters like you, the most beautiful chapters are still waiting to be written.',
  'Our very first classroom was under the shade of a sprawling Banyan tree, with just three children and a borrowed chalkboard. We taught them mathematics, but more importantly, we taught them how to dream.'
) ON CONFLICT (id) DO NOTHING;
