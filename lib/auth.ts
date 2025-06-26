"\"use client"

// This is a simplified version for preview
// Mock admin user for preview
const mockAdmins = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@mssnlasu.org",
    password: "admin123", // In a real app, this would be hashed
    role: "admin",
  },
]

export const authOptions = {
  providers: [
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      authorize: async (credentials: { email: string; password: string }) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // For preview, use mock data instead of database
        const user = mockAdmins.find((user) => user.email === credentials.email)

        if (!user || user.password !== credentials.password) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    },
  ],
}

// Mock function to check if user is authenticated
export const mockIsAuthenticated = (email: string, password: string) => {
  const user = mockAdmins.find((user) => user.email === email)
  return user && user.password === password
}
