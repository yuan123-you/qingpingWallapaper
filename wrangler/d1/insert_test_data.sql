-- 插入分类数据
INSERT INTO classify (name, cover_url, desc, sort, wall_count, update_time) VALUES 
('风景', 'https://picsum.photos/seed/scenery/400/300', '美丽的风景壁纸', 1, 0, 1706328000000),
('美女', 'https://picsum.photos/seed/beauty/400/300', '精选美女壁纸', 2, 0, 1706328000000),
('动漫', 'https://picsum.photos/seed/anime/400/300', '热门动漫壁纸', 3, 0, 1706328000000),
('游戏', 'https://picsum.photos/seed/game/400/300', '游戏主题壁纸', 4, 0, 1706328000000),
('星空', 'https://picsum.photos/seed/stars/400/300', '梦幻星空壁纸', 5, 0, 1706328000000);

-- 插入壁纸数据
INSERT INTO wallpaper (class_id, pic_url, title, tags, desc, score, score_count, download_count, favorite_count, status, create_time, update_time) VALUES 
(1, 'https://picsum.photos/seed/wall1/800/1200', '山间晨雾', '["风景", "自然", "清新"]', '清晨的山间薄雾，如诗如画', 4.8, 120, 560, 230, 1, 1706328000000, 1706328000000),
(1, 'https://picsum.photos/seed/wall2/800/1200', '湖畔夕阳', '["风景", "湖泊", "日落"]', '夕阳西下，湖面波光粼粼', 4.9, 98, 430, 180, 1, 1706328100000, 1706328100000),
(1, 'https://picsum.photos/seed/wall3/800/1200', '森林小径', '["风景", "森林", "小路"]', '幽静的森林小径，充满神秘', 4.7, 85, 320, 150, 1, 1706328200000, 1706328200000),
(2, 'https://picsum.photos/seed/wall4/800/1200', '樱花树下', '["美女", "樱花", "春天"]', '樱花盛开的季节，美如画卷', 4.8, 150, 680, 280, 1, 1706328300000, 1706328300000),
(2, 'https://picsum.photos/seed/wall5/800/1200', '海边漫步', '["美女", "海滩", "夏日"]', '夏日海滩，清新自然', 4.6, 120, 520, 210, 1, 1706328400000, 1706328400000),
(3, 'https://picsum.photos/seed/wall6/800/1200', '动漫少女', '["动漫", "少女", "可爱"]', '可爱的动漫少女形象', 4.9, 200, 750, 320, 1, 1706328500000, 1706328500000),
(3, 'https://picsum.photos/seed/wall7/800/1200', '机甲战士', '["动漫", "机甲", "热血"]', '热血机甲战士，震撼画面', 4.7, 180, 630, 290, 1, 1706328600000, 1706328600000),
(4, 'https://picsum.photos/seed/wall8/800/1200', '游戏角色', '["游戏", "角色", "精美"]', '精美的游戏角色壁纸', 4.8, 220, 820, 380, 1, 1706328700000, 1706328700000),
(4, 'https://picsum.photos/seed/wall9/800/1200', '游戏场景', '["游戏", "场景", "宏大"]', '宏大的游戏场景，震撼视觉', 4.6, 190, 710, 340, 1, 1706328800000, 1706328800000),
(5, 'https://picsum.photos/seed/wall10/800/1200', '璀璨星空', '["星空", "银河", "梦幻"]', '璀璨的银河星空，梦幻唯美', 4.9, 250, 890, 420, 1, 1706328900000, 1706328900000),
(5, 'https://picsum.photos/seed/wall11/800/1200', '流星雨', '["星空", "流星", "浪漫"]', '浪漫的流星雨，许下心愿', 4.8, 230, 810, 390, 1, 1706329000000, 1706329000000);

-- 更新分类的壁纸数量
UPDATE classify SET wall_count = 3 WHERE id = 1;
UPDATE classify SET wall_count = 2 WHERE id = 2;
UPDATE classify SET wall_count = 2 WHERE id = 3;
UPDATE classify SET wall_count = 2 WHERE id = 4;
UPDATE classify SET wall_count = 2 WHERE id = 5;

-- 插入轮播图数据
INSERT INTO banner (pic_url, jump_url, sort, status, create_time) VALUES 
('https://picsum.photos/seed/banner1/800/400', '', 1, 1, 1706328000000),
('https://picsum.photos/seed/banner2/800/400', '', 2, 1, 1706328000000),
('https://picsum.photos/seed/banner3/800/400', '', 3, 1, 1706328000000);

-- 插入公告数据
INSERT INTO notice (title, type, content, status, create_time) VALUES 
('欢迎使用轻屏壁纸V2.0', 'system', '轻屏壁纸V2.0正式上线！感谢您的支持与使用。', 1, 1706328000000),
('新功能上线通知', 'system', '我们新增了更多精美壁纸，欢迎体验！', 1, 1706328100000),
('使用指南', 'help', '如何使用：1. 浏览壁纸 2. 点击预览 3. 下载保存', 1, 1706328200000);
