# Error Handling Guide

## 🎯 Simple Rules

### Show Error Page For:

- **403** - Permission denied
- **404** - Route not found
- **500** - Server error
- **503** - Service unavailable

### Handle Inline (No Error Page):

- **401** - Not authenticated → Redirect to login
- **422** - Validation errors → Show in form
- **Forms** - Always handle inline

---

## 📄 Error Pages

### 1. Route 404: `src/app/not-found.tsx`

**When:** User visits non-existent URL like `/does-not-exist`

- Shows 404.png image
- "Go Home" and "Dashboard" buttons

### 2. Admin Errors: `src/app/(dashboard)/admin/error.tsx`

**When:** API errors or component crashes in admin area

- Detects error type (403, 404, 500, 503)
- Shows matching image from `/public/images/`
- "Try Again" and "Dashboard" buttons
- Shows technical details in development mode

### 3. Permission 403: Inside `auth-guard.tsx`

**When:** User lacks required permission for a route

- Shows 403.png image
- Displays specific permission needed
- "Go Back" and "Dashboard" buttons

---

## 🔧 How It Works

### API Calls (Default - Shows Error Page)

```typescript
// Throws error if API fails
const users = await http.get("/api/users");
// 500 → error.tsx shows
// 503 → error.tsx shows
```

### Forms (Handle Inline)

```typescript
// Forms never show error pages
const form = useForm(data, { validate: schema });

await form.post("/api/users", {
  onError: (error) => {
    toast.error(error.message); // Show inline
  },
});
```

### Auth (Handle Inline)

```typescript
// Auth operations never show error pages
const response = await http.post("/api/login", credentials, {
  throwOnError: false,
});

if (response.status === "error") {
  setError(response.message); // Show in form
}
```

---

## 🎨 Design System

All error pages follow the same beautiful design:

- **Hero Image** - PNG from `/public/images/` folder
- **Error Badge** - Orange pill with error code
- **Title** - Clear, user-friendly heading
- **Description** - Helpful message
- **Action Buttons** - Primary + secondary CTAs
- **Consistent Colors** - Matches admin theme

---

## 📊 Error Flow

```
User Action
    ↓
Is it a form?
    ↓
  YES → Show inline error (toast/field)
    ↓
  NO → API call
    ↓
API Error?
    ↓
401? → Redirect to login
403? → Show 403 page (with image)
404? → Show 404 page (with image)
500? → Show 500 page (with image)
503? → Show 503 page (with image)
```

---

## ✅ Summary

**3 Error Pages Total:**

1. `not-found.tsx` - Route 404
2. `error.tsx` - Admin errors (403, 500, 503)
3. Auth-guard - Permission 403

**All errors use beautiful images and consistent design!**

That's it - simple, clean, and beautiful! 🎉
