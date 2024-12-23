# Rails Trello

![LOGO](./apps/web-trello/public/logo.jpg)

## Live

- Check out the live demo of the application [here](https://trello-on-rails.vercel.app)

## Screenshots

### Desktop

![s1](./apps/web-trello/src/assets/ss1.png)
---
![s1](./apps/web-trello/src/assets/ss2.png)
---
![s1](./apps/web-trello/src/assets/ss3.png)

### Tablet

![s1](./apps/web-trello/src/assets/ss4.png)
---
![s1](./apps/web-trello/src/assets/ss5.png)
---
![s1](./apps/web-trello/src/assets/ss6.png)

### Mobile

![s1](./apps/web-trello/src/assets/ss7.png)
---
![s1](./apps/web-trello/src/assets/ss8.png)
---
![s1](./apps/web-trello/src/assets/ss9.png)
---
![s1](./apps/web-trello/src/assets/ss10.png)

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Development](#development)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Issues Encountered](#issues-encountered)
- [Learning Experience](#learning-experience)
- [Reflections and Future Improvements](#reflections-and-future-improvements)
- [Conclusion](#conclusion)
- [License](#license)

---

## Introduction

Rails Trello is a Trello-inspired application built with cutting-edge technologies and a monorepo architecture using Turborepo. It offers a seamless and responsive user experience for managing boards, lists, and cards, complete with advanced drag-and-drop functionality and secure authentication. This project is designed to simplify project management workflows and provide an intuitive interface for users to collaborate efficiently.

---

## Features

### Core Features

- **Home Page**:

  - A hero page designed to introduce users to the application and encourage them to get started quickly and easily.

- **User Accounts**:

  - Unique and separate boards, lists, and cards for each user account, ensuring data segregation and privacy.

- **Authentication**:

  - Robust authentication using **Auth.js** (formerly NextAuth) for secure access.
  - Supports both credential login and OAuth integration for Google and GitHub, making it accessible to a wide range of users.

- **Boards Management**:

  - Displays a comprehensive list of all boards that a user has created or is a member of on the `/boards` route.
  - Allows users to create new boards effortlessly from the intuitive user interface.

- **Board Detail Page**:

  - Showcases all lists and cards within a selected board, providing users with a detailed view of their projects.
  - Enables the creation of new lists and cards directly within a board.
 
- **Edit and Delete Cards**:
  
  - Add the ability to edit and delete lists directly from the UI.

- **Drag-and-Drop Functionality**:

  - used dnd kit @dnd-kit/core ( react-beautiful-dnd has been deprecated).
  - Smooth and intuitive movement of lists within a board to reorder priorities.
  - Shuffle and rearrange cards within a list to optimize task organization.
  - Seamless transfer of cards between lists with position persistence, ensuring data integrity and consistency.
  - All movements are automatically saved and persist in the database for a consistent experience across sessions.
    
- **CI/CD Pipeline**:
  
  - Implemented a **CI/CD pipeline** using **GitHub Actions** for automated workflows.  
  - Ensures code changes are tested, built, and deployed seamlessly with each update.  
  - Features automated testing, environment-specific deployments (e.g., dev, staging, production), and real-time error reporting.  
  - Improves development efficiency by reducing manual intervention and ensuring reliable deployments.
    
- **Unit Tests**:
  
  - The project includes unit tests to verify the behavior of the core functionalities.
  - These tests ensure the application's features work as expected.
    
- **Error Handling and Logging**:

  - The application includes robust error handling to ensure smooth operation even when unexpected issues arise. Any errors encountered are gracefully handled, and appropriate error messages are displayed to the user or logged for debugging.

- **Responsive Design**:

  - Fully optimized for devices of all screen sizes, ensuring usability on desktops, tablets, and mobile devices.

- **SEO Optimization**:

  - Enhanced frontend performance with SEO features, leveraging server-side rendering and static site generation in **Next.js**.

- **Containerization**:
  - Dockerized application ensures consistent environments for development, testing, and deployment, improving reliability and portability.

### Additional Features Under Development

- **Edit and Delete Cards**:
  - Implement functionality to edit and remove cards as required.

---

## Technology Stack

### Backend

- **Next.js**: A robust fullstack framework powering both the frontend and backend.
- **PostgreSQL**: A highly scalable relational database for storing user data, boards, lists, and cards.
- **Prisma ORM**: Simplifies database interactions with type-safe queries and schema management.
- **tRPC**: Provides seamless and type-safe API communication between the frontend and backend.

### Frontend

- **Next.js**: Delivers optimized pages through server-side rendering and static site generation.
- **Jotai**: A lightweight, flexible state management library for improved performance and simplicity.

### Authentication

- **Auth.js** (NextAuth): Enables secure user authentication with support for credentials, Google OAuth, and GitHub OAuth.

### DevOps

- **Turborepo**: A high-performance build system for managing the monorepo architecture efficiently.
- **Docker**: Ensures consistent development, testing, and production environments with containerization.

---

## Project Structure

This project is organized as a **monorepo** using **Turborepo**, allowing for efficient code management and scalable architecture. The Next.js application is located in the `apps/web-trello` directory and serves as the core frontend and backend of the application.

```bash
.
├── Dockerfile
├── README.md
├── apps
│   └── web-trello
│       ├── Dockerfile
│       ├── README.md
│       ├── components.json
│       ├── config
│       │   └── metadat.ts
│       ├── docker-compose.yml
│       ├── eslint.config.mjs
│       ├── next-env.d.ts
│       ├── next.config.ts
│       ├── package.json
│       ├── postcss.config.mjs
│       ├── prisma
│       │   ├── migrations
│       │   │   ├── 20241211111727_credential_login
│       │   │   │   └── migration.sql
│       │   │   ├── 20241213175829_add_board_to_schema
│       │   │   │   └── migration.sql
│       │   │   ├── 20241214041847_add_bg_image_to_board
│       │   │   │   └── migration.sql
│       │   │   ├── 20241214043546_make_board_id_user_id_unique
│       │   │   │   └── migration.sql
│       │   │   ├── 20241214071915_remove_duplicated_user_id
│       │   │   │   └── migration.sql
│       │   │   └── migration_lock.toml
│       │   └── schema.prisma
│       ├── public
│       │   ├── file.svg
│       │   ├── globe.svg
│       │   ├── logo.jpg
│       │   ├── next.svg
│       │   ├── vercel.svg
│       │   └── window.svg
│       ├── src
│       │   ├── _middleware.ts
│       │   ├── actions
│       │   │   └── actions.ts
│       │   ├── app
│       │   │   ├── api
│       │   │   │   ├── auth
│       │   │   │   │   └── [...nextauth]
│       │   │   │   │       └── route.ts
│       │   │   │   └── trpc
│       │   │   │       └── [trpc]
│       │   │   │           └── route.ts
│       │   │   ├── boards
│       │   │   │   ├── [boardId]
│       │   │   │   │   └── page.tsx
│       │   │   │   └── page.tsx
│       │   │   ├── fonts
│       │   │   │   ├── GeistMonoVF.woff
│       │   │   │   └── GeistVF.woff
│       │   │   ├── globals.css
│       │   │   ├── layout.tsx
│       │   │   ├── loading.tsx
│       │   │   ├── login
│       │   │   │   └── page.tsx
│       │   │   ├── not-found.tsx
│       │   │   ├── page.tsx
│       │   │   └── signup
│       │   │       └── page.tsx
│       │   ├── assets
│       │   │   ├── bg1.jpg
│       │   │   ├── bg2.jpg
│       │   │   ├── bg3.jpg
│       │   │   ├── bg4.jpg
│       │   │   ├── bg5.jpg
│       │   │   ├── bg6.jpg
│       │   │   ├── no-board.webp
│       │   │   └── not-found.webp
│       │   ├── auth.ts
│       │   ├── components
│       │   │   ├── Container
│       │   │   │   ├── Container.module.scss
│       │   │   │   ├── container.tsx
│       │   │   │   └── index.ts
│       │   │   ├── Item
│       │   │   │   ├── Item.module.scss
│       │   │   │   ├── Item.tsx
│       │   │   │   ├── components
│       │   │   │   │   ├── Action
│       │   │   │   │   │   ├── Action.module.scss
│       │   │   │   │   │   ├── Action.tsx
│       │   │   │   │   │   └── index.ts
│       │   │   │   │   ├── Handle
│       │   │   │   │   │   ├── Handle.tsx
│       │   │   │   │   │   └── index.ts
│       │   │   │   │   ├── Remove
│       │   │   │   │   │   ├── Remove.tsx
│       │   │   │   │   │   └── index.ts
│       │   │   │   │   └── index.ts
│       │   │   │   └── index.ts
│       │   │   ├── Provider.tsx
│       │   │   ├── account.tsx
│       │   │   ├── board
│       │   │   │   ├── trello-board.tsx
│       │   │   │   ├── trello-card.tsx
│       │   │   │   └── trello-list.tsx
│       │   │   ├── boardComponent
│       │   │   │   ├── MultipleContainers.tsx
│       │   │   │   ├── Virtualized.module.scss
│       │   │   │   ├── add-board.tsx
│       │   │   │   ├── boardNav.tsx
│       │   │   │   ├── multipleContainersKeyboardCoordinates.ts
│       │   │   │   └── sortable_items.tsx
│       │   │   ├── loader.tsx
│       │   │   ├── login-form.tsx
│       │   │   ├── nav-menus.tsx
│       │   │   ├── navbar.tsx
│       │   │   ├── signUp-form.tsx
│       │   │   ├── test.tsx
│       │   │   └── ui
│       │   │       ├── account.tsx
│       │   │       ├── add-board.tsx
│       │   │       ├── avatar.tsx
│       │   │       ├── background-beams-with-collision.tsx
│       │   │       ├── box-reveal.tsx
│       │   │       ├── button.tsx
│       │   │       ├── card.tsx
│       │   │       ├── dialog.tsx
│       │   │       ├── dropdown-menu.tsx
│       │   │       ├── flip-words.tsx
│       │   │       ├── input.tsx
│       │   │       ├── label.tsx
│       │   │       ├── layout.tsx
│       │   │       ├── nav-menus.tsx
│       │   │       ├── navbar.tsx
│       │   │       ├── navigation-menu.tsx
│       │   │       ├── select.tsx
│       │   │       ├── sheet.tsx
│       │   │       ├── skeleton.tsx
│       │   │       └── vortex.tsx
│       │   ├── lib
│       │   │   ├── atoms.ts
│       │   │   ├── db.ts
│       │   │   ├── getSession.ts
│       │   │   ├── schema.ts
│       │   │   ├── session.ts
│       │   │   └── utils.ts
│       │   ├── server
│       │   │   ├── actions
│       │   │   │   └── actions.ts
│       │   │   ├── client.ts
│       │   │   ├── context.ts
│       │   │   ├── index.ts
│       │   │   ├── routers
│       │   │   │   ├── board.ts
│       │   │   │   ├── card.ts
│       │   │   │   ├── list.ts
│       │   │   │   └── user.ts
│       │   │   └── trpc.ts
│       │   ├── styles
│       │   │   └── animations.css
│       │   ├── types
│       │   │   └── trello.ts
│       │   └── utilities
│       │       ├── createRange.ts
│       │       └── index.ts
│       ├── tailwind.config.ts
│       └── tsconfig.json
├── package.json
├── packages
│   ├── eslint-config
│   │   ├── README.md
│   │   ├── base.js
│   │   ├── next.js
│   │   ├── package.json
│   │   └── react-internal.js
│   ├── typescript-config
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   ├── package.json
│   │   └── react-library.json
│   └── ui
│       ├── eslint.config.js
│       ├── package.json
│       ├── src
│       │   ├── button.tsx
│       │   └── code.tsx
│       ├── tsconfig.json
│       └── turbo
│           └── generators
│               ├── config.ts
│               └── templates
│                   └── component.hbs
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── turbo.json

50 directories, 141 files
```

### Routes

| Route               | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `/`                 | Home hero page for new users to get started.              |
| `/login`            | Login page for existing users.                            |
| `/signup`           | Signup page for new users to create accounts.             |
| `/boards`           | Displays all boards a user has created or is a member of. |
| `/boards/[boardId]` | Displays all lists and cards within a specific board.     |

---

## Development

### Challenges Faced

1. **Implementing Drag-and-Drop Persistence**:

   - Dragging and dropping lists and cards required careful handling of database updates to ensure data consistency.
   - Solution: Used `tRPC` and Prisma to efficiently handle batched updates while ensuring type safety.

2. **Managing State Across Components**:

   - Maintaining the state of boards, lists, and cards was complex due to the interdependencies.
   - Solution: Leveraged **Jotai** for state management to simplify state updates and ensure reactivity.

3. **Optimizing for SEO**:

   - Rendering dynamic content while maintaining good SEO scores was challenging.
   - Solution: Utilized Next.js's server-side rendering (SSR) and static site generation (SSG) to achieve optimal results.

---

## Setup and Installation

### Prerequisites

- **Node.js**: Ensure Node.js (version 14 or higher) is installed.
- **PNPM**: Install PNPM for package management:
  ```bash
  npm install -g pnpm
  ```
- **Docker**: Install Docker for containerization.

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/IbnuJabir/rails-trello.git
   ```
2. Navigate to the project directory:
   ```bash
   cd rails-trello
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Generate Prisma client
   ```bash
   pnpx prisma generate
   ```
5. Set up environment variables in `.env` and `.env.local` files as follows:

### `.env`

```env
NEXT_PUBLIC_TRPC_BASE_URL="your-base-url-for-Auth.js"
DATABASE_URL="your-database-url"
```

### `.env.local`

```env
AUTH_SECRET="your-auth-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

---

## Running the Application

To run the application locally:

1. Start the development server:
   ```bash
   pnpm --filter web-trello run dev
   ```
2. Open `http://localhost:3000` in your browser to access the app.

---

## Issues Encountered

- **Database Connection Issues**:

  - Initial trouble connecting to the PostgreSQL database during development.
  - Solution: Updated Prisma configuration and ensured the correct `.env` file setup.

- **Drag-and-Drop Edge Cases**:

  - Issues with card movements being overwritten during simultaneous updates.
  - Solution: Implemented optimistic updates and thorough state management with `Jotai`.

---

## Learning Experience

This project taught me the importance of:

- **Type Safety**: Using `tRPC` and Prisma ensured that the API was reliable and scalable.
- **Monorepo Architecture**: Managing multiple workspaces efficiently with Turborepo.
- **Debugging**: Addressing real-world issues with drag-and-drop required a structured approach to debugging and persistence.
- **User-Centric Design**: Ensuring the UI/UX was intuitive, responsive, and accessible.

---

## Reflections and Future Improvements

- Add real-time collaboration features using **WebSockets**.
- Enhance monitoring with tools like **Sentry**.
- Improve error handling for edge cases during drag-and-drop operations.

---

## Conclusion

Rails Trello demonstrates my ability to design and implement a complex, scalable application with modern technologies. From addressing technical challenges to maintaining a clean codebase, this project reflects my technical proficiency, dedication, and problem-solving skills.

This home-take test assessment was a significant challenge that I embraced with full commitment, dedicating **77 hours over 5 days** to deliver the best product possible, with a focus on detailed improvements. Here's how it takes:  
- **Thursday (1st day):** 12 hours  
- **Friday (2nd day):** 16 hours  
- **Saturday (3rd day):** 18 hours  
- **Sunday (4th day):** 15 hours  
- **Monday (5th day):** 10 hours  

Leveraging the advantage of my **off-work week** allowed me to dive deeply into every aspect of the project, ensuring that each feature was carefully crafted and refined. Through this experience, I not only demonstrated my technical abilities but also showcased my time management, dedication, and attention to detail—qualities that I believe make me an excellent fit to join the Rails team as a Fullstack Developer.

Due to time constraints, I was unable to implement all of the planned features and enhancements. However, I successfully delivered almost all of the core functionalities outlined in the assessment guidelines. The application includes robust features such as user authentication, board management, drag-and-drop functionality, and a CI/CD pipeline, ensuring a functional and user-friendly experience. I plan to continue improving and expanding the project in the future.

In addition, this project highlights my passion for crafting reliable and user-friendly applications. The iterative approach I followed—focusing on improving performance, user experience, and functionality—exemplifies my commitment to excellence. I am excited about the opportunity to further contribute to your team, leveraging my skills to tackle real-world challenges and deliver impactful solutions.

Thank you for reviewing my work! I look forward to the possibility of joining the Rails team and contributing to its success.

Enjoy :D  

--- 

## Author

- Kedir Jabir - [GitHub](https://github.com/IbnuJabir) / [Twitter](https://x.com/Ibnu_J1) / [LinkedIn](https://www.linkedin.com/in/ibnu-jabir/)

---

## License

This project is licensed under the MIT License.
