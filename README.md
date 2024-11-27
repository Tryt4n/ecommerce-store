# E-Commerce Store

## Project Overview

This is a comprehensive e-commerce web application built with Next.js, featuring a full-featured online store with user, admin, and purchasing functionalities.

![Home Page](/public/screenshots/homepage.png "Home Page with Featured Products")

## Tech Stack

- **Frontend**:

  - Next.js
  - Tailwind CSS
  - Shadcn UI Components
  - TypeScript

- **Authentication**:

  - Kinde Auth

- **Backend & Database**:

  - Prisma ORM
  - PostgreSQL Database

- **Payment Processing**:

  - Stripe

- **Additional Services**:
  - Resend (Email)
  - ImageKit (Image Optimization & Storage)

![Login Page](public/screenshots/signin.png "Kinde Authentication Login")

## Features

### Public Routes

1. **Home Page (`/`)**

   - Displays most popular and newest products

2. **Products Page (`/products`)**

   - All products with pagination
   - Display options: Card/List view
   - Sorting capabilities:
     - Alphabetical
     - Price
     - Date Added
   - Search functionality
   - Ascending/Descending options

   ![Products Page](public/screenshots/products.png "Products Listing")
   ![Products Page With Filters](public/screenshots/products-search_and_open_cart.png "Products Listing with Filters")

3. **Product Detail Page (`/products/:id`)**

   - Product image carousel (using `swiper`)
   - Detailed product description
   - Product specifications
   - Downloadable files:
     - Admin-uploaded file
     - Automatic PDF catalog

   ![Product Detail Page](public/screenshots/product-page.png "Product Detail with Carousel")

### User Routes (Authenticated)

1. **Order History (`/orders`)**

   - Complete order information
   - Order details: products, quantities, total amount
   - Discount information
   - Invoice/Receipt download options

   ![Order History](public/screenshots/order-history.png "User Order History")

2. **Shopping Cart (`/purchase`)**

   - Cart item details
   - Quantity management
   - Discount code application
   - Invoice option

   ![Shopping Cart](public/screenshots/shopping-cart.png "Shopping Cart with Discount Option")

3. **Finalizing the transaction with `stripe`**

   ![Stripe - finalize transaction](public/screenshots/purchase.png "Stripe - finalize transaction")
   ![Stripe - receipt](public/screenshots/receipt.png "Stripe - order receipt page")
   ![Stripe - invoice](public/screenshots/invoice.png "Stripe - invoice PDF")

### Admin Routes

1. **Dashboard (`/admin`)**

   - Summary charts and analytics

   ![Admin Dashboard](public/screenshots/admin-dashboard.png "Admin Summary Dashboard")

2. **Product Management (`/admin/products`)**

   - Product list
   - Activation/Deactivation
   - Filtering and sorting options
   - Downloadable product details
   - Product deletion

   ![Admin Products Management](public/screenshots/admin-products.png "Product Management Interface")

3. **Add/Edit Product (`/admin/new`, `/admin/products/:id`)**

   - Comprehensive product creation form
   - Fields: name, price, categories, description
   - File and image uploads

   ![Add/Edit Product](public/screenshots/admin-product-edit.png "Product Creation/Editing Form")

4. **Discount Codes Management**

   - Active and expired coupon sections
   - Filtering and sorting options

   ![Discount Codes](public/screenshots/admin-discount-codes.png "Discount Codes Management")

5. **Add Discount Code**

   - Coupon creation with flexible application rules

   ![Add Discount Code](public/screenshots/admin-add-discount-code.png "Add Discount Code page")

## Additional Screens

### Additional Important Interfaces

- **Admin Navbar Dropdown**

  ![Admin Navbar Dropdown](public/screenshots/admin-links.png "Admin Navigation Dropdown")

- **Order Confirmation Email**

  ![Order Confirmation Email](public/screenshots/email-order.png "Transactional Order Confirmation Email")
