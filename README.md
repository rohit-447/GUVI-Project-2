# Full-Stack Invoice Generator

A complete, full-stack automated invoice generator designed for freelancers and small businesses. This application allows users to create, manage, and track professional invoices with ease, featuring a clean, responsive interface and a robust backend.


---

## Features

- **Dynamic Invoice Creation:** A user-friendly form to add client details, project information, and itemized billing lines.
- **Automatic Calculations:** Subtotals, taxes (10% GST), and grand totals are calculated in real-time.
- **Sequential Invoice Numbering:** Automatically generates a new, sequential invoice number for the current year (e.g., `INV-2025-001`).
- **Database Integration:** Save, view, and manage all invoices in a MongoDB database.
- **PDF Generation:** Generate and download professional, print-ready PDF invoices on the fly.
- **Email Invoices:** Send invoices directly to clients as PDF attachments using the SendGrid API.
- **Client & Reports Dashboard:** View all past invoices in a clean table, with the ability to update payment statuses.
- **Financial Dashboard:** Get a clear overview of total earned, pending, and due amounts.
- **Secure Credentials:** Uses `.env` files to securely manage API keys and URLs.

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Email Service:** SendGrid API
- **PDF Generation:** PDFKit

---

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.
- A free [SendGrid](https://sendgrid.com/) account for sending emails.

### 1. Backend Setup

First, set up the Node.js server.

```bash
# 1. Navigate to the backend folder
cd invoice-backend

# 2. Install dependencies
npm install

# 3. Create a .env file and add your credentials (see Environment Variables section)

# 4. Start the backend server
node server.js

# The server will be running on http://localhost:3001
```

### 2. Frontend Setup

Next, set up the Next.js frontend in a separate terminal.

```bash
# 1. Navigate to the frontend folder
cd invoice-app

# 2. Install dependencies
npm install

# 3. Create a .env.local file and add your API URL (see Environment Variables section)

# 4. Start the frontend development server
npm run dev

# The application will be running on http://localhost:3000
```

---

## Environment Variables

### Backend (`invoice-backend/.env`)

Create a file named `.env` in the `invoice-backend` directory and add the following:

-   `SENDGRID_API_KEY`: Your API key from your SendGrid account.
-   `SENDER_EMAIL`: The email address you have verified as a "Single Sender" in SendGrid.

```
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDER_EMAIL=your_verified_sendgrid_email@example.com
```

### Frontend (`invoice-app/.env.local`)

Create a file named `.env.local` in the `invoice-app` directory and add the following:

-   `NEXT_PUBLIC_API_BASE_URL`: The full URL where your backend server is running.

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

---

## API Endpoints

The backend provides the following API endpoints:

| Method  | Endpoint                       | Description                                  |
| :------ | :----------------------------- | :------------------------------------------- |
| `GET`   | `/api/invoices`                | Fetches all saved invoices.                  |
| `GET`   | `/api/latest-invoice-number`   | Gets the next sequential invoice number.     |
| `POST`  | `/api/save-invoice`            | Saves an invoice to the database.            |
| `POST`  | `/api/create-invoice`          | Saves an invoice and returns a PDF.          |
| `POST`  | `/api/send-invoice`            | Sends an invoice via email.                  |
| `PATCH` | `/api/invoices/:id/status`     | Updates the payment status of an invoice.    |

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
