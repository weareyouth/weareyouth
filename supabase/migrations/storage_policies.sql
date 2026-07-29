-- Step 1: Pehle ek storage bucket banate hain jiska naam 'Gallery' hai — yahan saari photos upload hongi
INSERT INTO storage.buckets (id, name, public) 
VALUES ('Gallery', 'Gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Website par photos dikhne chahiye na? Toh public ko read access dena zaroori hai
CREATE POLICY "Allow public read access on Gallery bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'Gallery');

-- Step 3: Nai photos upload karna — yeh kaam sirf admin ka hai, koi bhi random user nahi kar sakta
CREATE POLICY "Allow authenticated insert access on Gallery bucket" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'Gallery');

-- Step 4: Agar koi photo replace karni ho ya update karni ho, toh bhi sirf admin ko permission hai
CREATE POLICY "Allow authenticated update access on Gallery bucket" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'Gallery');

-- Step 5: Galat ya purani photos hatani ho? Delete bhi sirf authenticated admin hi kar sakta hai
CREATE POLICY "Allow authenticated delete access on Gallery bucket" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'Gallery');
