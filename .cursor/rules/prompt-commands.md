# Prompt Commands

## 1. PDF Analyze

/// Chức năng:
/// Phân tích PDF, screenshot, spec nghiệp vụ trước khi code
/// Giúp AI hiểu business flow, entities, permissions, tables và logic hệ thống
/// Không sinh code ở bước này, chỉ phân tích và bóc tách yêu cầu

Analyze this PDF, screenshot, or business specification before writing any code.

Extract:

* title
* sections
* tables
* business flow
* actors
* entities
* permissions
* validation rules
* approval process
* important notes

Do not generate frontend or backend code.
Only analyze the business logic and structure.

---

## 2. Frontend Generate

/// Chức năng:
/// Sinh giao diện React từ PDF, ảnh, screenshot hoặc UI design
/// Tạo layout chuẩn production-level, responsive, reusable components
/// Chỉ làm frontend UI, không viết backend

Frontend only.

Convert this screenshot, image, UI design, or PDF into a full production-level React UI.

Requirements:

* React + TypeScript
* responsive layout
* reusable components
* clean folder structure
* production-level code
* pixel-approximate layout
* semantic HTML
* form/table sections if needed
* no backend code
* no PDF generation

Generate real web UI only.

---

## 3. Backend Generate

/// Chức năng:
/// Sinh backend production-level với Node.js + Express + MongoDB
/// Tạo CRUD, routes, controllers, services, validations và clean architecture
/// Chỉ xử lý backend logic, không viết giao diện frontend

Backend only.

Generate a production-level backend using:

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

Include:

* CRUD APIs
* routes
* controllers
* services
* models
* validations
* pagination
* filtering
* sorting
* search
* error handling
* middleware
* clean architecture

Do not generate frontend code.

---

## 4. Database Design

/// Chức năng:
/// Thiết kế database MongoDB chuẩn production
/// Xác định collections, schema, relations, indexes và validation rules
/// Tối ưu hiệu năng và đảm bảo tương thích MongoDB Atlas

Database only.

Design a production-ready MongoDB database structure.

Include:

* collections
* schema fields
* required fields
* optional fields
* relations
* indexes
* validation rules
* timestamps
* status fields
* soft delete strategy
* performance optimization

The design must be compatible with MongoDB Atlas.

---

## 5. FE ↔ BE Integration

/// Chức năng:
/// Kết nối frontend với backend thành hệ thống hoàn chỉnh
/// Tạo axios, React Query, token handling, auth flow và protected routes
/// Giúp FE gọi API đúng chuẩn production

Integration only.

Connect frontend and backend cleanly.

Generate:

* axios instance
* API service layer
* React Query integration
* token handling
* JWT authentication flow
* refresh token flow
* protected routes
* loading states
* error handling
* request/response handling
* form submit connection

Make FE and BE work together like a real production project.

---

## 6. Code Review

/// Chức năng:
/// Review code AI đã sinh trước khi đưa vào project thật
/// Tìm bug, anti-pattern, security issues, spec mismatch và lỗi logic
/// Giúp tránh merge code sai vào production

Review only.

Review this generated code like a senior engineer.

Check for:

* logic bugs
* anti-patterns
* security issues
* missing validation
* bad folder structure
* duplicated code
* performance issues
* spec mismatch
* bad naming
* weak architecture

Be strict and provide real fix suggestions.

---

## 7. Refactor Clean Code

/// Chức năng:
/// Refactor code cũ thành clean code chuẩn senior
/// Tối ưu folder structure, naming, maintainability và scalability
/// Giúp code dễ mở rộng và dễ teamwork lâu dài

Refactor only.

Improve the existing codebase for production quality.

Focus on:

* better folder structure
* naming consistency
* clean code
* maintainability
* scalability
* reusable logic
* service separation
* validation layer
* error handling
* performance optimization

Refactor like a senior software architect.

---

## 8. Testing Validation

/// Chức năng:
/// Test và validate code trước khi release
/// Kiểm tra unit test, integration test, edge cases và business rules
/// Giúp giảm bug production và kiểm soát release risk

Testing only.

Validate the project before release.

Check:

* unit tests
* integration tests
* API validation
* form validation
* permission validation
* edge cases
* failure cases
* unexpected input handling
* loading states
* race conditions
* business rule validation

Identify missing test cases and release risks clearly.
