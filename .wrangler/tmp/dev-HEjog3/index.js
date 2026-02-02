var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-jO7cEp/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// wrangler/src/index.js
var CACHE_TTL = {
  SHORT: 300,
  MEDIUM: 3600,
  LONG: 86400,
  TOKEN: 604800,
  LOCK: 600
};
var logger = {
  info: /* @__PURE__ */ __name((message, meta = {}) => {
    console.log(JSON.stringify({
      level: "info",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      message,
      ...meta
    }));
  }, "info"),
  error: /* @__PURE__ */ __name((message, error = {}) => {
    console.error(JSON.stringify({
      level: "error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      message,
      error: error.message,
      stack: error.stack
    }));
  }, "error"),
  debug: /* @__PURE__ */ __name((message, meta = {}) => {
    console.log(JSON.stringify({
      level: "debug",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      message,
      ...meta
    }));
  }, "debug")
};
var stmt = {
  getBannerList: "SELECT * FROM banner WHERE status = 1 ORDER BY sort ASC, id DESC",
  getNoticeList: "SELECT * FROM notice WHERE status = 1 ORDER BY create_time DESC LIMIT ? OFFSET ?",
  getNoticeListByType: "SELECT * FROM notice WHERE type = ? AND status = 1 ORDER BY create_time DESC LIMIT ? OFFSET ?",
  getNoticeCount: "SELECT COUNT(*) as count FROM notice WHERE status = 1",
  getWallpaperList: "SELECT * FROM wallpaper WHERE status = 1 ORDER BY create_time DESC LIMIT ? OFFSET ?",
  getWallpaperListByClassId: "SELECT * FROM wallpaper WHERE class_id = ? AND status = 1 ORDER BY create_time DESC LIMIT ? OFFSET ?",
  getWallpaperListRecommend: "SELECT * FROM wallpaper WHERE status = 1 ORDER BY score DESC, download_count DESC LIMIT ? OFFSET ?",
  getWallpaperDetail: "SELECT * FROM wallpaper WHERE id = ?",
  getWallpaperCount: "SELECT COUNT(*) as count FROM wallpaper WHERE status = 1",
  updateWallpaperScore: "UPDATE wallpaper SET score = ?, score_count = ? WHERE id = ?",
  incrementWallpaperDownload: "UPDATE wallpaper SET download_count = download_count + 1 WHERE id = ?",
  addUserBehavior: "INSERT INTO user_behavior (openid, wall_id, type, create_time) VALUES (?, ?, ?, ?)",
  checkUserBehavior: "SELECT * FROM user_behavior WHERE openid = ? AND wall_id = ? AND type = ?",
  searchWallpaper: "SELECT * FROM wallpaper WHERE (title LIKE ? OR tags LIKE ?) AND status = 1 ORDER BY create_time DESC LIMIT ? OFFSET ?",
  getClassifyList: "SELECT * FROM classify ORDER BY sort ASC, id DESC",
  getAdminByUsername: "SELECT * FROM admin WHERE username = ?",
  addWallpaper: "INSERT INTO wallpaper (class_id, pic_url, title, tags, desc, status, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  updateWallpaper: "UPDATE wallpaper SET title = ?, class_id = ?, pic_url = ?, tags = ?, desc = ?, status = ?, update_time = ? WHERE id = ?",
  deleteWallpaper: "DELETE FROM wallpaper WHERE id = ?",
  addClassify: "INSERT INTO classify (name, cover_url, desc, sort, wall_count, update_time) VALUES (?, ?, ?, ?, ?, ?)",
  updateClassify: "UPDATE classify SET name = ?, cover_url = ?, desc = ?, sort = ?, update_time = ? WHERE id = ?",
  deleteClassify: "DELETE FROM classify WHERE id = ?",
  addBanner: "INSERT INTO banner (pic_url, jump_url, sort, status, create_time) VALUES (?, ?, ?, ?, ?)",
  updateBanner: "UPDATE banner SET pic_url = ?, jump_url = ?, sort = ?, status = ? WHERE id = ?",
  deleteBanner: "DELETE FROM banner WHERE id = ?",
  addNotice: "INSERT INTO notice (title, type, content, status, create_time) VALUES (?, ?, ?, ?, ?)",
  updateNotice: "UPDATE notice SET title = ?, type = ?, content = ?, status = ? WHERE id = ?",
  deleteNotice: "DELETE FROM notice WHERE id = ?",
  getClassifyCount: "SELECT COUNT(*) as count FROM classify",
  getTotalDownloads: "SELECT SUM(download_count) as count FROM wallpaper",
  getUserBehaviorCount: "SELECT COUNT(*) as count FROM user_behavior"
};
function successResponse(data, message = "success") {
  return new Response(JSON.stringify({
    errCode: 0,
    errMsg: message,
    ...data
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(successResponse, "successResponse");
function errorResponse(errCode, errMsg, status = 500) {
  return new Response(JSON.stringify({
    errCode,
    errMsg
  }), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
__name(errorResponse, "errorResponse");
async function verifyToken(request, env) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return {
        valid: false,
        response: new Response(JSON.stringify({
          errCode: 401,
          errMsg: "Missing authorization header"
        }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        })
      };
    }
    const token = authHeader.replace("Bearer ", "");
    const adminId = await env.CACHE.get(`token_${token}`);
    if (!adminId) {
      return {
        valid: false,
        response: new Response(JSON.stringify({
          errCode: 401,
          errMsg: "Invalid or expired token"
        }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        })
      };
    }
    return { valid: true, adminId };
  } catch (error) {
    console.error("Error in verifyToken:", error);
    return {
      valid: false,
      response: new Response(JSON.stringify({
        errCode: 500,
        errMsg: error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      })
    };
  }
}
__name(verifyToken, "verifyToken");
async function generateToken(adminId, env) {
  try {
    console.log("Generating token for admin ID:", adminId);
    const token = `admin_${adminId}_${Date.now()}_${Math.random().toString(36).substr(2)}`;
    await env.CACHE.put(`token_${token}`, adminId.toString(), { expirationTtl: CACHE_TTL.TOKEN });
    console.log("Token saved to cache");
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
}
__name(generateToken, "generateToken");
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    try {
      logger.info("Request Started", { method: request.method, path });
      let response;
      if (path.startsWith("/api/user/")) {
        logger.debug("Routing to user handler");
        response = await handleUserRequest(request, url, env, ctx);
      } else if (path.startsWith("/api/admin/")) {
        logger.debug("Routing to admin handler");
        response = await handleAdminRequest(request, url, env, ctx);
      } else {
        logger.debug("Path not found, returning 404");
        response = new Response(JSON.stringify({
          errCode: 404,
          errMsg: "Not Found"
        }), {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      logger.info("Response", { status: response.status });
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    } catch (error) {
      logger.error("Main Error", error);
      return new Response(JSON.stringify({
        errCode: 500,
        errMsg: error.message || "Internal Server Error"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  }
};
async function handleUserRequest(request, url, env, ctx) {
  const path = url.pathname.replace("/api/user/", "");
  const method = request.method;
  switch (path) {
    case "banner/list":
      if (method === "GET") return await handleBannerList(request, url, env, ctx);
      break;
    case "notice/list":
      if (method === "GET") return await handleNoticeList(request, url, env, ctx);
      break;
    case "wallpaper/list":
      if (method === "GET") return await handleWallpaperList(request, url, env, ctx);
      break;
    case "wallpaper/detail":
      if (method === "GET") return await handleWallpaperDetail(request, url, env, ctx);
      break;
    case "wallpaper/score":
      if (method === "POST") return await handleWallpaperScore(request, url, env, ctx);
      break;
    case "behavior/add":
      if (method === "POST") return await handleBehaviorAdd(request, url, env, ctx);
      break;
    case "behavior/check":
      if (method === "GET") return await handleBehaviorCheck(request, url, env, ctx);
      break;
    case "search":
      if (method === "GET") return await handleSearch(request, url, env, ctx);
      break;
    case "search/hot":
      if (method === "GET") return await handleHotSearch(request, url, env, ctx);
      break;
  }
  return errorResponse(404, "Not Found");
}
__name(handleUserRequest, "handleUserRequest");
async function handleAdminRequest(request, url, env, ctx) {
  const path = url.pathname.replace("/api/admin/", "");
  const method = request.method;
  switch (path) {
    case "login":
      if (method === "POST") return await handleLogin(request, url, env, ctx);
      break;
    case "wallpaper/list":
      if (method === "GET") return await handleWallpaperListAdmin(request, url, env, ctx);
      break;
    case "wallpaper/add":
      if (method === "POST") return await handleWallpaperAdd(request, url, env, ctx);
      break;
    case "wallpaper/update":
      if (method === "POST") return await handleWallpaperUpdate(request, url, env, ctx);
      break;
    case "wallpaper/delete":
      if (method === "POST") return await handleWallpaperDelete(request, url, env, ctx);
      break;
    case "classify/list":
      if (method === "GET") return await handleClassifyList(request, url, env, ctx);
      break;
    case "classify/add":
      if (method === "POST") return await handleClassifyAdd(request, url, env, ctx);
      break;
    case "classify/update":
      if (method === "POST") return await handleClassifyUpdate(request, url, env, ctx);
      break;
    case "classify/delete":
      if (method === "POST") return await handleClassifyDelete(request, url, env, ctx);
      break;
    case "banner/list":
      if (method === "GET") return await handleBannerListAdmin(request, url, env, ctx);
      break;
    case "banner/add":
      if (method === "POST") return await handleBannerAdd(request, url, env, ctx);
      break;
    case "banner/update":
      if (method === "POST") return await handleBannerUpdate(request, url, env, ctx);
      break;
    case "banner/delete":
      if (method === "POST") return await handleBannerDelete(request, url, env, ctx);
      break;
    case "notice/list":
      if (method === "GET") return await handleNoticeListAdmin(request, url, env, ctx);
      break;
    case "notice/add":
      if (method === "POST") return await handleNoticeAdd(request, url, env, ctx);
      break;
    case "notice/update":
      if (method === "POST") return await handleNoticeUpdate(request, url, env, ctx);
      break;
    case "notice/delete":
      if (method === "POST") return await handleNoticeDelete(request, url, env, ctx);
      break;
    case "statistics":
      if (method === "GET") return await handleStatistics(request, url, env, ctx);
      break;
  }
  return errorResponse(404, "Not Found");
}
__name(handleAdminRequest, "handleAdminRequest");
async function handleBannerList(request, url, env, ctx) {
  try {
    const cacheKey = "banner_list";
    const cached = await env.CACHE.get(cacheKey, "json");
    if (cached) {
      return successResponse({ bannerList: cached });
    }
    const result = await env.DB.prepare(stmt.getBannerList).all();
    await env.CACHE.put(cacheKey, JSON.stringify(result.results || []), {
      expirationTtl: CACHE_TTL.LONG
    });
    return successResponse({ bannerList: result.results || [] });
  } catch (error) {
    console.error("Error in handleBannerList:", error);
    return errorResponse(500, error.message);
  }
}
__name(handleBannerList, "handleBannerList");
async function handleNoticeList(request, url, env, ctx) {
  try {
    const type = url.searchParams.get("type") || "";
    const pageNum = parseInt(url.searchParams.get("pageNum") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
    const offset = (pageNum - 1) * pageSize;
    let query = stmt.getNoticeList;
    let params = [pageSize, offset];
    if (type) {
      query = stmt.getNoticeListByType;
      params = [type, pageSize, offset];
    }
    const result = await env.DB.prepare(query).bind(...params).all();
    const countResult = await env.DB.prepare(stmt.getNoticeCount).all();
    const total = countResult.results[0]?.count || 0;
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success",
      list: result.results || [],
      total
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleNoticeList:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleNoticeList, "handleNoticeList");
async function handleWallpaperList(request, url, env, ctx) {
  try {
    const classId = url.searchParams.get("class_id") || "";
    const pageNum = parseInt(url.searchParams.get("pageNum") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
    const offset = (pageNum - 1) * pageSize;
    let query = stmt.getWallpaperList;
    let params = [pageSize, offset];
    if (classId) {
      query = stmt.getWallpaperListByClassId;
      params = [classId, pageSize, offset];
    }
    const result = await env.DB.prepare(query).bind(...params).all();
    const countResult = await env.DB.prepare(stmt.getWallpaperCount).all();
    const total = countResult.results[0]?.count || 0;
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success",
      list: result.results || [],
      total
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleWallpaperList:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleWallpaperList, "handleWallpaperList");
async function handleWallpaperDetail(request, url, env, ctx) {
  try {
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing id"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const result = await env.DB.prepare(stmt.getWallpaperDetail).bind(id).first();
    if (!result) {
      return new Response(JSON.stringify({
        errCode: 404,
        errMsg: "Wallpaper not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success",
      wallpaper: result
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleWallpaperDetail:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleWallpaperDetail, "handleWallpaperDetail");
async function handleWallpaperScore(request, url, env, ctx) {
  try {
    const body = await request.json();
    const { wall_id, score } = body;
    if (!wall_id || !score) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing required parameters"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const wallpaper = await env.DB.prepare(stmt.getWallpaperDetail).bind(wall_id).first();
    if (!wallpaper) {
      return new Response(JSON.stringify({
        errCode: 404,
        errMsg: "Wallpaper not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const currentScore = wallpaper.score || 0;
    const currentCount = wallpaper.score_count || 0;
    const newScore = (currentScore * currentCount + score) / (currentCount + 1);
    await env.DB.prepare(stmt.updateWallpaperScore).bind(newScore, currentCount + 1, wall_id).run();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleWallpaperScore:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleWallpaperScore, "handleWallpaperScore");
async function handleBehaviorAdd(request, url, env, ctx) {
  try {
    const body = await request.json();
    const { type, wall_id, openid } = body;
    if (!type || !wall_id) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing required parameters"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await env.DB.prepare(stmt.addUserBehavior).bind(openid || "", wall_id, type, Date.now()).run();
    if (type === "download") {
      await env.DB.prepare(stmt.incrementWallpaperDownload).bind(wall_id).run();
    }
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleBehaviorAdd:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleBehaviorAdd, "handleBehaviorAdd");
async function handleBehaviorCheck(request, url, env, ctx) {
  try {
    const type = url.searchParams.get("type");
    const wallId = url.searchParams.get("wall_id");
    const openid = url.searchParams.get("openid") || "";
    if (!type || !wallId) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing required parameters"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const result = await env.DB.prepare(stmt.checkUserBehavior).bind(openid, wallId, type).first();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success",
      exists: !!result
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleBehaviorCheck:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleBehaviorCheck, "handleBehaviorCheck");
async function handleSearch(request, url, env, ctx) {
  try {
    const keyword = url.searchParams.get("keyword") || "";
    const pageNum = parseInt(url.searchParams.get("pageNum") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
    const offset = (pageNum - 1) * pageSize;
    if (!keyword) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing keyword"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const result = await env.DB.prepare(stmt.searchWallpaper).bind(`%${keyword}%`, `%${keyword}%`, pageSize, offset).all();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success",
      list: result.results || []
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleSearch:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleSearch, "handleSearch");
async function handleHotSearch(request, url, env, ctx) {
  try {
    const cacheKey = "hot_search";
    const cached = await env.CACHE.get(cacheKey, "json");
    if (cached) {
      return successResponse({ hotSearch: cached });
    }
    const hotSearch = ["\u98CE\u666F", "\u7F8E\u5973", "\u52A8\u6F2B", "\u6E38\u620F", "\u661F\u7A7A", "\u57CE\u5E02", "\u81EA\u7136", "\u52A8\u7269", "\u6C7D\u8F66", "\u79D1\u6280"];
    await env.CACHE.put(cacheKey, JSON.stringify(hotSearch), {
      expirationTtl: CACHE_TTL.MEDIUM
    });
    return successResponse({ hotSearch });
  } catch (error) {
    console.error("Error in handleHotSearch:", error);
    return errorResponse(500, error.message);
  }
}
__name(handleHotSearch, "handleHotSearch");
async function handleLogin(request, url, env, ctx) {
  try {
    console.log("=== Login Request Started ===");
    const body = await request.json();
    const { username, password } = body;
    console.log("Username:", username);
    console.log("Password provided:", password ? "***" : "empty");
    if (!username || !password) {
      console.log("Missing username or password");
      return errorResponse(400, "Missing username or password");
    }
    console.log("Step 1: Checking lock status...");
    const lockKey = `lock_${username}`;
    const lockStatus = await env.CACHE.get(lockKey);
    console.log("Lock status:", lockStatus);
    if (lockStatus) {
      console.log("Account is locked");
      return errorResponse(429, "Account locked, please try again later");
    }
    console.log("Step 2: Querying database...");
    const admin = await env.DB.prepare(stmt.getAdminByUsername).bind(username).first();
    console.log("Admin found:", admin ? "yes" : "no");
    if (!admin) {
      console.log("Admin not found in database");
      await incrementFailCount(env, username, lockKey);
      return errorResponse(401, "Invalid username or password");
    }
    console.log("Step 3: Checking password...");
    if (admin.password !== password) {
      console.log("Password mismatch");
      await incrementFailCount(env, username, lockKey);
      return errorResponse(401, "Invalid username or password");
    }
    console.log("Step 4: Login successful, generating token...");
    await env.CACHE.delete(`fail_${username}`);
    const token = await generateToken(admin.id, env);
    console.log("Token generated:", token.substring(0, 20) + "...");
    console.log("Step 5: Returning success response...");
    return successResponse({
      token,
      expireTime: Date.now() + CACHE_TTL.TOKEN * 1e3
    });
  } catch (error) {
    console.error("=== Login Error ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return errorResponse(500, error.message);
  }
}
__name(handleLogin, "handleLogin");
async function incrementFailCount(env, username, lockKey) {
  const failCount = parseInt(await env.CACHE.get(`fail_${username}`) || "0") + 1;
  if (failCount >= 3) {
    await env.CACHE.put(lockKey, "locked", { expirationTtl: CACHE_TTL.LOCK });
  } else {
    await env.CACHE.put(`fail_${username}`, failCount.toString(), { expirationTtl: CACHE_TTL.LOCK });
  }
}
__name(incrementFailCount, "incrementFailCount");
async function handleWallpaperListAdmin(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const pageNum = parseInt(url.searchParams.get("pageNum") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
    const offset = (pageNum - 1) * pageSize;
    const result = await env.DB.prepare(stmt.getWallpaperList).bind(pageSize, offset).all();
    const countResult = await env.DB.prepare(stmt.getWallpaperCount).all();
    const total = countResult.results[0]?.count || 0;
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success",
      list: result.results || [],
      total
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleWallpaperListAdmin:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleWallpaperListAdmin, "handleWallpaperListAdmin");
async function handleWallpaperAdd(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const body = await request.json();
    const { title, class_id, pic_url, tags, desc, status } = body;
    if (!title || !class_id || !pic_url) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing required parameters"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const result = await env.DB.prepare(stmt.addWallpaper).bind(
      class_id,
      pic_url,
      title,
      JSON.stringify(tags || []),
      desc || "",
      status || 1,
      Date.now(),
      Date.now()
    ).run();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success",
      id: result.meta.last_row_id
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleWallpaperAdd:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleWallpaperAdd, "handleWallpaperAdd");
async function handleWallpaperUpdate(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const body = await request.json();
    const { id, title, class_id, pic_url, tags, desc, status } = body;
    if (!id) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing id"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await env.DB.prepare(stmt.updateWallpaper).bind(
      title,
      class_id,
      pic_url,
      JSON.stringify(tags || []),
      desc || "",
      status,
      Date.now(),
      id
    ).run();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleWallpaperUpdate:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleWallpaperUpdate, "handleWallpaperUpdate");
async function handleWallpaperDelete(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing id"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await env.DB.prepare(stmt.deleteWallpaper).bind(id).run();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleWallpaperDelete:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleWallpaperDelete, "handleWallpaperDelete");
async function handleClassifyList(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const result = await env.DB.prepare(stmt.getClassifyList).all();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success",
      list: result.results || []
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleClassifyList:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleClassifyList, "handleClassifyList");
async function handleClassifyAdd(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const body = await request.json();
    const { name, cover_url, desc, sort } = body;
    if (!name || !cover_url) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing required parameters"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const result = await env.DB.prepare(stmt.addClassify).bind(
      name,
      cover_url,
      desc || "",
      sort || 0,
      0,
      Date.now()
    ).run();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success",
      id: result.meta.last_row_id
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleClassifyAdd:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleClassifyAdd, "handleClassifyAdd");
async function handleClassifyUpdate(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const body = await request.json();
    const { id, name, cover_url, desc, sort } = body;
    if (!id) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing id"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await env.DB.prepare(stmt.updateClassify).bind(
      name,
      cover_url,
      desc || "",
      sort,
      Date.now(),
      id
    ).run();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleClassifyUpdate:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleClassifyUpdate, "handleClassifyUpdate");
async function handleClassifyDelete(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing id"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await env.DB.prepare(stmt.deleteClassify).bind(id).run();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleClassifyDelete:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleClassifyDelete, "handleClassifyDelete");
async function handleBannerListAdmin(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const result = await env.DB.prepare(stmt.getBannerList).all();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success",
      list: result.results || []
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleBannerListAdmin:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleBannerListAdmin, "handleBannerListAdmin");
async function handleBannerAdd(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const body = await request.json();
    const { pic_url, jump_url, sort, status } = body;
    if (!pic_url) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing pic_url"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const result = await env.DB.prepare(stmt.addBanner).bind(
      pic_url,
      jump_url || "",
      sort || 0,
      status || 1,
      Date.now()
    ).run();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success",
      id: result.meta.last_row_id
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleBannerAdd:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleBannerAdd, "handleBannerAdd");
async function handleBannerUpdate(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const body = await request.json();
    const { id, pic_url, jump_url, sort, status } = body;
    if (!id) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing id"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await env.DB.prepare(stmt.updateBanner).bind(
      pic_url,
      jump_url || "",
      sort,
      status,
      id
    ).run();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleBannerUpdate:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleBannerUpdate, "handleBannerUpdate");
async function handleBannerDelete(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing id"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await env.DB.prepare(stmt.deleteBanner).bind(id).run();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleBannerDelete:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleBannerDelete, "handleBannerDelete");
async function handleNoticeListAdmin(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const pageNum = parseInt(url.searchParams.get("pageNum") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
    const offset = (pageNum - 1) * pageSize;
    const result = await env.DB.prepare(stmt.getNoticeList).bind(pageSize, offset).all();
    const countResult = await env.DB.prepare(stmt.getNoticeCount).all();
    const total = countResult.results[0]?.count || 0;
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success",
      list: result.results || [],
      total
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleNoticeListAdmin:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleNoticeListAdmin, "handleNoticeListAdmin");
async function handleNoticeAdd(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const body = await request.json();
    const { title, type, content, status } = body;
    if (!title || !content) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing required parameters"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const result = await env.DB.prepare(stmt.addNotice).bind(
      title,
      type || "system",
      content,
      status || 1,
      Date.now()
    ).run();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success",
      id: result.meta.last_row_id
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleNoticeAdd:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleNoticeAdd, "handleNoticeAdd");
async function handleNoticeUpdate(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const body = await request.json();
    const { id, title, type, content, status } = body;
    if (!id) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing id"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await env.DB.prepare(stmt.updateNotice).bind(
      title,
      type,
      content,
      status,
      id
    ).run();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleNoticeUpdate:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleNoticeUpdate, "handleNoticeUpdate");
async function handleNoticeDelete(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return new Response(JSON.stringify({
        errCode: 400,
        errMsg: "Missing id"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await env.DB.prepare(stmt.deleteNotice).bind(id).run();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleNoticeDelete:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleNoticeDelete, "handleNoticeDelete");
async function handleStatistics(request, url, env, ctx) {
  try {
    const auth = await verifyToken(request, env);
    if (!auth.valid) {
      return auth.response;
    }
    const wallpaperCount = await env.DB.prepare(stmt.getWallpaperCount).first();
    const classifyCount = await env.DB.prepare(stmt.getClassifyCount).first();
    const downloadCount = await env.DB.prepare(stmt.getTotalDownloads).first();
    const userBehaviorCount = await env.DB.prepare(stmt.getUserBehaviorCount).first();
    return new Response(JSON.stringify({
      errCode: 0,
      errMsg: "success",
      statistics: {
        wallpaperCount: wallpaperCount?.count || 0,
        classifyCount: classifyCount?.count || 0,
        downloadCount: downloadCount?.count || 0,
        userBehaviorCount: userBehaviorCount?.count || 0
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in handleStatistics:", error);
    return new Response(JSON.stringify({
      errCode: 500,
      errMsg: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleStatistics, "handleStatistics");

// C:/Users/游源/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// C:/Users/游源/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-jO7cEp/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// C:/Users/游源/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-jO7cEp/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
