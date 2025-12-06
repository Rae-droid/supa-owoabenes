module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/lib/database/supabase.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabaseBrowser",
    ()=>supabaseBrowser,
    "supabaseServer",
    ()=>supabaseServer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-route] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://kiclnmpvaebuzcndebxz.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpY2xubXB2YWVidXpjbmRlYnh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwOTQxNTEsImV4cCI6MjA3OTY3MDE1MX0.UQ8OzGKjKHDcD6xl3GN0p3r3FlEXyWMSOTukkXp58QY");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabaseBrowser = (()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
})();
const supabaseServer = (()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const key = supabaseServiceKey || supabaseAnonKey;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, key);
})();
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/products/delete/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/database/supabase.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function POST(request) {
    console.log("DELETE API called");
    try {
        const body = await request.json();
        console.log("Request body received");
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"]) {
            console.error("Supabase not initialized");
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Database client not initialized"
            }, {
                status: 500
            });
        }
        const { productId, productData, deletedBy = "Admin", reason = "No reason provided" } = body;
        if (!productId || !productData) {
            console.error("Missing required fields");
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Missing required fields: productId and productData"
            }, {
                status: 400
            });
        }
        console.log("Attempting to delete from products table...");
        // First, delete from products table
        const { error: deleteError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from("products").delete().eq("id", productId);
        console.log("Delete from products - error:", deleteError);
        if (deleteError) {
            console.error("Error deleting from products:", deleteError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: `Failed to delete from products: ${deleteError.message}`
            }, {
                status: 500
            });
        }
        console.log("Attempting to insert into deleted_products table...");
        // Then, save to deleted_products table
        const { error: archiveError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from("deleted_products").insert({
            product_id: productId,
            product_name: productData.name || "Unknown Product",
            product_data: productData,
            deleted_by: deletedBy,
            reason: reason
        });
        console.log("Insert into deleted_products - error:", archiveError);
        if (archiveError) {
            console.error("Error archiving to deleted_products:", archiveError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: `Failed to archive: ${archiveError.message}`
            }, {
                status: 500
            });
        }
        console.log("Success! Product deleted and archived");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Product deleted and archived successfully"
        });
    } catch (error) {
        console.error("[v0] Error in delete product API:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message || "Unknown error"
        }, {
            status: 500
        });
    }
}
async function GET() {
    console.log("GET deleted products API called");
    try {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"]) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Database client not initialized"
            }, {
                status: 500
            });
        }
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from("deleted_products").select("*").order("deleted_at", {
            ascending: false
        });
        if (error) {
            console.error("Error fetching deleted products:", error);
            throw error;
        }
        console.log("Fetched deleted products:", data?.length || 0);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: data || []
        });
    } catch (error) {
        console.error("[v0] Error fetching deleted products:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4fba6d5f._.js.map