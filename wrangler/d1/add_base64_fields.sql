-- 为 wallpaper 表添加 pic_base64 字段
ALTER TABLE wallpaper ADD COLUMN pic_base64 TEXT;

-- 为 classify 表添加 cover_base64 字段
ALTER TABLE classify ADD COLUMN cover_base64 TEXT;

-- 为 banner 表添加 pic_base64 字段
ALTER TABLE banner ADD COLUMN pic_base64 TEXT;
