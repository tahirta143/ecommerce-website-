"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, AlertCircle, RefreshCw, FolderPlus, Bug, Server } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { showToast } from "@/components/ui/Toast";
import { showConfirm } from "@/components/ui/ConfirmModal";
import { cn } from "@/lib/utils";

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryName, setCategoryName] = useState("");
    const [debugInfo, setDebugInfo] = useState({});
    const [apiTestResults, setApiTestResults] = useState([]);

    const containerRef = useRef(null);
    const modalRef = useRef(null);
    const apiBase = "https://backend-with-node-js-ueii.onrender.com";

    // Test API endpoints
    const testApiEndpoints = async () => {
        const tests = [];

        // Test 1: Check if server is reachable
        try {
            const start = Date.now();
            const pingRes = await fetch(`${apiBase}/`, { method: 'HEAD' });
            const pingTime = Date.now() - start;
            tests.push({
                name: 'Server Ping',
                status: pingRes.ok ? '✅' : '⚠️',
                details: `${pingRes.status} ${pingRes.statusText} (${pingTime}ms)`
            });
        } catch (err) {
            tests.push({
                name: 'Server Ping',
                status: '❌',
                details: err.message
            });
        }

        // Test 2: Check categories endpoint
        try {
            const res = await fetch(`${apiBase}/api/categories`);
            const data = await res.json();
            tests.push({
                name: 'Categories API',
                status: res.ok ? '✅' : '❌',
                details: `${res.status} - ${data.message || 'No message'}`
            });
        } catch (err) {
            tests.push({
                name: 'Categories API',
                status: '❌',
                details: err.message
            });
        }

        // Test 3: Check authentication
        const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
        tests.push({
            name: 'Authentication',
            status: token ? '✅' : '❌',
            details: token ? `Token found (${token.length} chars)` : 'No token found'
        });

        setApiTestResults(tests);
        console.log('API Tests:', tests);
    };

    // Enhanced fetch with timeout
    const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (err) {
            clearTimeout(id);
            if (err.name === 'AbortError') {
                throw new Error(`Request timeout after ${timeout}ms`);
            }
            throw err;
        }
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
        console.log('🔑 Current Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

        if (!token) {
            alert("⚠️ Authentication token not found. Please log in again.");
            return null;
        }

        return {
            "Content-Type": "application/json",
            "token": token,
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Origin": window.location.origin
        };
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setDebugInfo(prev => ({ ...prev, action: 'fetching', timestamp: new Date().toISOString() }));

            console.group('🔄 Fetching Data');

            const categoriesUrl = `${apiBase}/api/categories`;
            console.log('📡 Categories URL:', categoriesUrl);

            const catRes = await fetchWithTimeout(categoriesUrl, {
                headers: {
                    "Accept": "application/json"
                }
            }, 15000);

            console.log('📥 Categories Response:', {
                status: catRes.status,
                statusText: catRes.statusText,
                ok: catRes.ok,
                headers: Object.fromEntries(catRes.headers.entries())
            });

            if (!catRes.ok) {
                const errorText = await catRes.text();
                console.error('❌ Categories Error Text:', errorText);
                throw new Error(`Categories API: ${catRes.status} ${catRes.statusText}`);
            }

            const catText = await catRes.text();
            console.log('📥 Categories Raw Text:', catText);

            let catData;
            try {
                catData = JSON.parse(catText);
                console.log('📥 Categories Parsed:', catData);
            } catch (parseError) {
                console.error('❌ JSON Parse Error:', parseError);
                throw new Error(`Invalid JSON from server: ${catText.substring(0, 100)}`);
            }

            if (!catData.success) {
                throw new Error(catData.message || "Failed to fetch categories");
            }

            setCategories(catData.data || []);
            setDebugInfo(prev => ({
                ...prev,
                categoriesCount: catData.data?.length || 0,
                lastFetch: new Date().toLocaleTimeString()
            }));

            // Try to fetch products (optional)
            try {
                const prodRes = await fetchWithTimeout(`${apiBase}/api/products`, {}, 15000);
                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    if (prodData.success) {
                        setAllProducts(prodData.data || []);
                    }
                }
            } catch (prodError) {
                console.warn('⚠️ Products fetch failed:', prodError);
            }

            console.groupEnd();

        } catch (err) {
            console.error('❌ Fetch Data Error:', err);
            setError(err.message);
            setDebugInfo(prev => ({
                ...prev,
                error: err.message,
                lastError: new Date().toLocaleTimeString()
            }));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        testApiEndpoints();

        // Log all network requests
        const originalFetch = window.fetch;
        window.fetch = async function (...args) {
            const [url, options = {}] = args;
            const requestId = Math.random().toString(36).substring(7);

            console.group(`🌐 Request #${requestId}`);
            console.log('📤 URL:', url);
            console.log('📤 Method:', options.method || 'GET');
            console.log('📤 Headers:', options.headers);
            if (options.body) {
                console.log('📤 Body:', typeof options.body === 'string' ? options.body : 'Not a string');
            }

            const startTime = Date.now();
            try {
                const response = await originalFetch.apply(this, args);
                const endTime = Date.now();

                console.log('📥 Status:', response.status, response.statusText);
                console.log('📥 Time:', `${endTime - startTime}ms`);
                console.log('📥 Headers:', Object.fromEntries(response.headers.entries()));

                // Clone response to read body without consuming it
                const clonedResponse = response.clone();
                try {
                    const text = await clonedResponse.text();
                    console.log('📥 Response Body:', text.substring(0, 500));
                } catch (bodyError) {
                    console.log('📥 Response Body: [Cannot read]');
                }

                console.groupEnd();
                return response;
            } catch (err) {
                console.error('❌ Request Error:', err);
                console.groupEnd();
                throw err;
            }
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) {
            alert("Please enter a category name");
            return;
        }

        const operation = editingCategory ? 'UPDATE' : 'CREATE';
        console.group(`🔄 ${operation} CATEGORY`);

        try {
            setIsSubmitting(true);
            setDebugInfo(prev => ({
                ...prev,
                action: 'submitting',
                operation,
                categoryName
            }));

            const headers = getAuthHeaders();
            if (!headers) {
                setIsSubmitting(false);
                console.groupEnd();
                return;
            }

            // Try different endpoint variations
            const endpointVariations = [
                `${apiBase}/api/categories${editingCategory ? `/${editingCategory._id}` : ''}`,
                `${apiBase}/api/categories${editingCategory ? `/${editingCategory._id}/` : '/'}`,
                `${apiBase}/api/admin/categories${editingCategory ? `/${editingCategory._id}` : ''}`
            ];

            let lastError = null;
            let successfulResponse = null;

            for (const url of endpointVariations) {
                try {
                    console.log(`🔄 Trying endpoint: ${url}`);

                    const response = await fetchWithTimeout(url, {
                        method: editingCategory ? 'PUT' : 'POST',
                        headers,
                        body: JSON.stringify({
                            name: categoryName.trim(),
                            ...(editingCategory && { _id: editingCategory._id })
                        }),
                    }, 15000);

                    console.log(`📥 Response from ${url}:`, {
                        status: response.status,
                        statusText: response.statusText,
                        ok: response.ok
                    });

                    const responseText = await response.text();
                    console.log('📥 Response Text:', responseText);

                    if (response.ok) {
                        successfulResponse = { response, responseText, url };
                        break;
                    } else {
                        lastError = { response, responseText, url };
                    }

                } catch (err) {
                    console.error(`❌ Failed for ${url}:`, err);
                    lastError = { error: err, url };
                }
            }

            if (!successfulResponse && lastError) {
                const { response, responseText, url, error } = lastError;

                if (error) {
                    throw error;
                }

                if (response) {
                    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

                    // Try to extract more specific error
                    if (responseText) {
                        try {
                            const errorData = JSON.parse(responseText);
                            if (errorData.error) errorMessage = errorData.error;
                            if (errorData.message) errorMessage = errorData.message;
                        } catch {
                            if (responseText.includes('Not Found')) errorMessage = 'Endpoint not found';
                            if (responseText.includes('Unauthorized')) errorMessage = 'Unauthorized - Invalid token';
                            if (responseText.includes('Forbidden')) errorMessage = 'Forbidden - No permission';
                        }
                    }

                    // Specific status code handling
                    if (response.status === 401) {
                        errorMessage = 'Authentication failed. Please log in again.';
                        localStorage.removeItem('admin_token');
                        localStorage.removeItem('token');
                    } else if (response.status === 403) {
                        errorMessage = 'Permission denied. Admin access required.';
                    } else if (response.status === 404) {
                        errorMessage = `API endpoint not found: ${url}`;
                    } else if (response.status === 500) {
                        errorMessage = 'Server internal error. Check server logs.';
                    } else if (response.status === 400) {
                        errorMessage = 'Bad request. Check category name format.';
                    }

                    throw new Error(errorMessage);
                }

                throw new Error('Unknown error occurred');
            }

            // Process successful response
            const { response, responseText, url } = successfulResponse;
            console.log(`✅ Success from: ${url}`);

            let data;
            try {
                data = JSON.parse(responseText);
                console.log('📥 Parsed Data:', data);
            } catch (parseError) {
                // If no JSON but status is OK, assume success
                if (response.ok) {
                    console.log('✅ Non-JSON success response');
                    // Refresh data
                    await fetchData();
                    closeModal();
                    alert(`✅ Category ${editingCategory ? 'updated' : 'created'} successfully!`);
                    console.groupEnd();
                    return;
                }
                throw new Error('Invalid JSON response from server');
            }

            // Handle different response structures
            if (data.success || response.ok) {
                const updatedCategory = data.data || data.category || data;

                if (editingCategory) {
                    setCategories(prev => prev.map(c =>
                        c._id === editingCategory._id
                            ? { ...c, ...updatedCategory, name: categoryName.trim() }
                            : c
                    ));
                } else {
                    if (updatedCategory._id) {
                        setCategories(prev => [...prev, updatedCategory]);
                    } else {
                        await fetchData();
                    }
                }

                showToast(`Category "${categoryName}" ${editingCategory ? 'updated' : 'created'} successfully!`, "success");
                closeModal();

            } else {
                throw new Error(data.message || data.error || `Operation failed (${response.status})`);
            }

        } catch (err) {
            console.error('❌ Submit Error Details:', {
                message: err.message,
                stack: err.stack,
                editingCategory,
                categoryName
            });

            // Show detailed error
            let userMessage = err.message;

            if (err.message.includes('timeout')) {
                userMessage = 'Request timeout. Server is not responding.';
            } else if (err.message.includes('NetworkError')) {
                userMessage = 'Network error. Check your internet connection.';
            } else if (err.message.includes('CORS')) {
                userMessage = 'CORS error. Server may not be configured properly.';
            } else if (err.message.includes('token') || err.message.includes('auth')) {
                userMessage = 'Authentication error. Please log out and log in again.';
            }

            alert(`Category Operation Failed: ${err.message}`);
            setDebugInfo(prev => ({
                ...prev,
                submitError: err.message,
                submitErrorTime: new Date().toLocaleTimeString()
            }));

        } finally {
            setIsSubmitting(false);
            console.groupEnd();
        }
    };
    const handleDelete = async (id) => {
        const category = categories.find(c => c._id === id);
        if (!category) return;

        showConfirm({
            title: "Delete Category",
            message: `Are you sure you want to delete "${category.name}"? This will affect ${getProductCount(category.name)} product(s).`,
            confirmText: "Delete",
            cancelText: "Keep it",
            isDestructive: true,
            onConfirm: async () => {
                console.group(`🗑️ DELETE CATEGORY: ${category.name}`);
                try {
                    setIsDeleting(id);
                    const headers = getAuthHeaders();
                    if (!headers) {
                        setIsDeleting(null);
                        console.groupEnd();
                        return;
                    }

                    // Remove Content-Type for DELETE
                    const { 'Content-Type': _, ...deleteHeaders } = headers;

                    const url = `${apiBase}/api/categories/${id}`;
                    const response = await fetchWithTimeout(url, {
                        method: 'DELETE',
                        headers: deleteHeaders,
                    }, 15000);

                    if (response.status === 204 || response.ok) {
                        setCategories(prev => prev.filter(c => c._id !== id));
                        showToast(`Category "${category.name}" deleted successfully!`, "success");
                        console.groupEnd();
                        return;
                    }

                    // Parse error response
                    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                    const responseText = await response.text();
                    if (responseText) {
                        try {
                            const errorData = JSON.parse(responseText);
                            if (errorData.message) errorMessage = errorData.message;
                        } catch {
                            errorMessage = responseText.substring(0, 200);
                        }
                    }
                    throw new Error(errorMessage);

                } catch (err) {
                    console.error('❌ Delete Error:', err);
                    showToast(`Delete Failed: ${err.message}`, "error");
                } finally {
                    setIsDeleting(null);
                    console.groupEnd();
                }
            }
        });
    };

    const openModal = (category = null) => {
        setEditingCategory(category);
        setCategoryName(category ? category.name : "");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setCategoryName("");
    };

    useGSAP(() => {
        if (isLoading) return;
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(".header-section", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8 })
            .fromTo(".category-row", { opacity: 0, x: -10 }, { opacity: 1, x: 0, stagger: 0.1, duration: 0.4 }, "-=0.4");
    }, { scope: containerRef, dependencies: [isLoading] });

    useGSAP(() => {
        if (isModalOpen) {
            gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" });
        }
    }, [isModalOpen]);

    const getProductCount = (categoryName) => {
        if (!categoryName || !allProducts.length) return 0;
        const normalizedCatName = categoryName.toLowerCase().trim();
        return allProducts.filter(p =>
            p.category && p.category.toLowerCase().trim() === normalizedCatName
        ).length;
    };

    // Direct API test functions
    const testCreateCategory = async () => {
        const testName = `TestCategory_${Date.now()}`;
        console.group(`🧪 TEST CREATE: ${testName}`);

        try {
            const headers = getAuthHeaders();
            if (!headers) return;

            const response = await fetch(`${apiBase}/api/categories`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ name: testName })
            });

            console.log('Test Response:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            const text = await response.text();
            console.log('Test Response Text:', text);

            if (response.ok) {
                alert(`✅ Test PASSED: Created "${testName}"`);
                fetchData();
            } else {
                alert(`❌ Test FAILED: ${response.status} - ${text.substring(0, 100)}`);
            }
        } catch (err) {
            console.error('Test Error:', err);
            alert(`❌ Test ERROR: ${err.message}`);
        }
        console.groupEnd();
    };

    const testUpdateCategory = async () => {
        if (categories.length === 0) {
            alert("No categories to test with");
            return;
        }

        const category = categories[0];
        const newName = `${category.name}_TEST_${Date.now()}`;
        console.group(`🧪 TEST UPDATE: ${category.name} → ${newName}`);

        try {
            const headers = getAuthHeaders();
            if (!headers) return;

            const response = await fetch(`${apiBase}/api/categories/${category._id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ name: newName })
            });

            console.log('Test Response:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            const text = await response.text();
            console.log('Test Response Text:', text);

            if (response.ok) {
                alert(`✅ Test PASSED: Updated to "${newName}"`);
                fetchData();
            } else {
                alert(`❌ Test FAILED: ${response.status} - ${text.substring(0, 100)}`);
            }
        } catch (err) {
            console.error('Test Error:', err);
            alert(`❌ Test ERROR: ${err.message}`);
        }
        console.groupEnd();
    };

    return (
        <div ref={containerRef} className="space-y-8 min-h-screen">
            {/* Debug Panel */}
            <div className="bg-gradient-to-r from-zinc-900 to-black text-white p-4 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Bug className="size-5 text-green-400" />
                        <h3 className="font-bold">Debug Panel</h3>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={testApiEndpoints}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs bg-white/10 border-white/20"
                        >
                            <Server className="size-3 mr-1" />
                            Test API
                        </Button>
                        <Button
                            onClick={() => console.clear()}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs bg-white/10 border-white/20"
                        >
                            Clear Console
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-zinc-400">Status:</span>
                            <span className={isLoading ? "text-yellow-400" : error ? "text-red-400" : "text-green-400"}>
                                {isLoading ? "Loading..." : error ? "Error" : "Ready"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-400">Categories:</span>
                            <span className="font-mono">{categories.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-400">Products:</span>
                            <span className="font-mono">{allProducts.length}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-zinc-400">API Base:</span>
                            <span className="font-mono text-xs truncate" title={apiBase}>
                                {apiBase.replace('https://', '')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-400">Token:</span>
                            <span className={localStorage.getItem('token') ? "text-green-400" : "text-red-400"}>
                                {localStorage.getItem('token') ? "Present" : "Missing"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-zinc-400 mb-1">Quick Tests:</div>
                        <div className="flex gap-2">
                            <Button
                                onClick={testCreateCategory}
                                size="sm"
                                className="h-7 text-xs px-2"
                            >
                                Test Create
                            </Button>
                            <Button
                                onClick={testUpdateCategory}
                                size="sm"
                                className="h-7 text-xs px-2"
                                disabled={categories.length === 0}
                            >
                                Test Update
                            </Button>
                            <Button
                                onClick={fetchData}
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs px-2"
                            >
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>

                {apiTestResults.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                        <h4 className="text-xs font-bold text-zinc-400 mb-2">API Tests:</h4>
                        <div className="space-y-1">
                            {apiTestResults.map((test, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <span className="text-xs">{test.status}</span>
                                    <span className="text-xs text-zinc-300">{test.name}:</span>
                                    <span className="text-xs text-zinc-400">{test.details}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 header-section">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Category Management</h1>
                    <p className="text-zinc-500 font-medium">Manage product categories for your store</p>
                </div>
                <Button
                    onClick={() => openModal()}
                    className="rounded-full h-12 px-6 shadow-lg bg-black text-white hover:bg-zinc-800 transition-all active:scale-95 flex items-center gap-2"
                >
                    <Plus className="size-5" />
                    Add Category
                </Button>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <div className="size-12 border-4 border-zinc-200 border-t-black rounded-full animate-spin" />
                    <p className="text-zinc-500 font-medium animate-pulse">Loading Categories...</p>
                    <p className="text-sm text-zinc-400">Connecting to: {apiBase.replace('https://', '')}</p>
                </div>
            ) : error ? (
                <div className="py-20 text-center space-y-4">
                    <div className="inline-flex p-4 bg-red-50 rounded-full text-red-500 mb-2">
                        <AlertCircle className="size-8" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900">Failed to Load Categories</h2>
                    <p className="text-zinc-500 max-w-md mx-auto">{error}</p>
                    <div className="space-y-2">
                        <Button onClick={fetchData} variant="outline" className="rounded-full">
                            <RefreshCw className="size-4 mr-2" />
                            Try Again
                        </Button>
                        <p className="text-sm text-zinc-400">
                            If this persists, check:
                            1. Server status 2. CORS settings 3. Network connection
                        </p>
                    </div>
                </div>
            ) : categories.length === 0 ? (
                <div className="py-20 text-center space-y-4 bg-white rounded-[2rem] border border-zinc-100 shadow-sm">
                    <div className="inline-flex p-6 bg-zinc-50 rounded-full text-zinc-300 mb-2">
                        <FolderPlus className="size-12" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900">No Categories Yet</h2>
                    <p className="text-zinc-500">Add your first category to get started</p>
                    <Button onClick={() => openModal()} className="rounded-full">
                        Create First Category
                    </Button>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50/50 border-b border-zinc-100">
                                <tr>
                                    <th className="px-8 py-5 text-sm font-bold text-zinc-500">Category Name</th>
                                    <th className="px-8 py-5 text-sm font-bold text-zinc-500">Products</th>
                                    <th className="px-8 py-5 text-sm font-bold text-zinc-500">ID</th>
                                    <th className="px-8 py-5 text-sm font-bold text-zinc-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {categories.map((cat) => {
                                    const itemCount = getProductCount(cat.name);
                                    return (
                                        <tr key={cat._id} className="category-row group hover:bg-zinc-50 transition-colors">
                                            <td className="px-8 py-6">
                                                <span className="font-bold text-zinc-900">{cat.name}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-xs font-bold",
                                                    itemCount > 0 ? "bg-green-50 text-green-600" : "bg-zinc-100 text-zinc-400"
                                                )}>
                                                    {itemCount} {itemCount === 1 ? 'Product' : 'Products'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm text-zinc-400 font-mono truncate max-w-[200px]" title={cat._id}>
                                                    {cat._id.substring(0, 8)}...
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        onClick={() => openModal(cat)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors active:scale-90"
                                                    >
                                                        <Edit className="size-4" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(cat._id)}
                                                        disabled={isDeleting === cat._id}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:bg-red-50 hover:text-red-600 rounded-full transition-colors active:scale-90"
                                                    >
                                                        {isDeleting === cat._id ? (
                                                            <div className="size-4 border-2 border-zinc-200 border-t-red-500 rounded-full animate-spin" />
                                                        ) : (
                                                            <Trash2 className="size-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div ref={modalRef} className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-100">
                        <div className="p-8 pb-0">
                            <h2 className="text-2xl font-bold text-zinc-900">
                                {editingCategory ? "Update Category" : "New Category"}
                            </h2>
                            <p className="text-zinc-500 text-sm mt-1">
                                {editingCategory
                                    ? `Editing: ${editingCategory.name}`
                                    : "Enter the category name below."
                                }
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700 ml-1">Category Name *</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-black focus:outline-none transition-all font-medium"
                                    placeholder="e.g. Electronics"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    onClick={closeModal}
                                    variant="outline"
                                    className="flex-1 rounded-full h-12"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !categoryName.trim()}
                                    className="flex-1 rounded-full h-12 bg-black text-white"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </div>
                                    ) : editingCategory ? (
                                        "Update"
                                    ) : (
                                        "Create"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}