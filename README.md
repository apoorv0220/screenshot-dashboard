# Screenshot Dashboard [https://screenshot-dashboard.onrender.com/]

This is a Next.js web application that allows users to view screenshots uploaded from a desktop application, grouped by session, and generate AI-powered summaries of those sessions.

## Tech Stack

*   **Next.js:** A React framework for building server-rendered and statically generated web applications.
*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A superset of JavaScript that adds static typing.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly styling HTML elements.
*   **NextAuth.js:** An authentication library for Next.js that supports various authentication providers (in this case, Google OAuth).
*   **Mongoose:** An Object Data Modeling (ODM) library for MongoDB and Node.js.
*   **MongoDB Atlas:** A cloud-based MongoDB service.
*   **OpenAI API:** An API for accessing OpenAI's language models (GPT-4o) for generating summaries.
*   **Cloudinary:** Cloud image storage and management.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd screenshot-dashboard
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**

    *   Create a `.env.local` file in the root directory of the project.
    *   Add the following environment variables to the `.env.local` file:

        ```
        GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
        GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

        CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
        CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
        CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET

        OPENAI_API_KEY=YOUR_OPENAI_API_KEY

        NEXTAUTH_SECRET=A_VERY_LONG_RANDOM_STRING_GENERATED_BY_OPENSSL
        NEXTAUTH_URL=http://localhost:3000

        MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority
        ```

    *   Replace the placeholders with your actual API keys and database credentials.
    *   Generate a secure random string for `NEXTAUTH_SECRET` using `openssl rand -base64 32`.

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    This will start the Next.js development server on `http://localhost:3000`.

## Usage

1.  **Access the Dashboard:** Open your browser and go to `http://localhost:3000`.
2.  **Sign in with Google:** Click the "Sign in" button to authenticate with your Google account.
3.  **View Sessions:** The dashboard will display a list of sessions, with a few screenshots for each.
4.  **Select a Session:** Click on a session card to select it.
5.  **Generate Summary:** Click the "Generate Summary" button to generate an AI-powered summary of the selected session.
6.  **View Screenshots and Summary:** The screenshots and summary will be displayed on the page.

To checkkout live demo follow athe above usage instructions for: (https://screenshot-dashboard.onrender.com/)

## Deployment

To deploy this Next.js app to Vercel:

1.  Create a Vercel account (if you don't have one).
2.  Install the Vercel CLI: `npm install -g vercel`.
3.  Run `vercel` in your project directory.
4.  Follow the prompts to link your project to Vercel.
5.  Set the necessary environment variables in your Vercel project settings.
6.  Deploy your application.

To deploy on render create a yaml file and deploy there.
