import { AuthContext, AuthProvider, type AuthApiResponse } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext.hooks";
import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Helper to create a mock Response object
const mockResponse = (ok: boolean, status: number, data: AuthApiResponse) => ({
  ok,
  status,
  text: () => Promise.resolve(JSON.stringify(data)),
  json: () => Promise.resolve(data),
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("AuthContext", () => {
  const testUser = {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    role: "user"
  };

  const testToken = "fake-token";

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>
      {children}
    </AuthProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe("login", () => {
    it("should log in the user and set the token and user in context", async () => {
      mockFetch.mockImplementationOnce(() => Promise.resolve(
        mockResponse(true, 200, { token: testToken, user: testUser })
      ));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login("test@example.com", "password");
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/auth/login",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify({ email: "test@example.com", password: "password" })
        })
      );

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "clofit:token",
        testToken
      );

      expect(result.current.user).toEqual(testUser);
    });

    it("should throw an error on invalid credentials", async () => {
      mockFetch.mockImplementationOnce(() => Promise.resolve(
        mockResponse(false, 400, { error: "invalid_credentials" })
      ));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.login("test@example.com", "wrong-password");
        })
      ).rejects.toThrow("Invalid email or password");
    });

    it("should throw an error on network failure", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.login("test@example.com", "password");
        })
      ).rejects.toThrow(/Cannot connect to server/);
    });
  });

  describe("logout", () => {
    it("should remove the token and set user to null", async () => {
      // First, set up a logged-in state
      localStorageMock.setItem("clofit:token", testToken);
      // Mock the fetch calls in order:
      // 1. useEffect's fetch to "/api/auth/me" -> return 401 to clear token and set user to null
      // 2. logout's fetch to "/api/auth/logout" -> return success
      mockFetch
        .mockImplementationOnce(() => Promise.resolve(mockResponse(false, 401, {})))
        .mockImplementationOnce(() => Promise.resolve(mockResponse(true, 200, {})));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.logout();
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("clofit:token");
      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  describe("register", () => {
    it("should register a new user and set the token and user", async () => {
      mockFetch.mockImplementationOnce(() => Promise.resolve(
        mockResponse(true, 200, { token: testToken, user: testUser })
      ));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.register("Test User", "test@example.com", "1234567890", "password");
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/auth/register",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            phone: "1234567890",
            password: "password"
          })
        })
      );

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "clofit:token",
        testToken
      );

      expect(result.current.user).toEqual(testUser);
    });

    it("should throw an error on email already registered", async () => {
      mockFetch.mockImplementationOnce(() => Promise.resolve(
        mockResponse(false, 400, { error: "email_taken" })
      ));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.register("Test User", "test@example.com", "1234567890", "password");
        })
      ).rejects.toThrow("Email is already registered");
    });
  });

  describe("forgotPassword", () => {
    it("should call the forgot password endpoint", async () => {
      mockFetch.mockImplementationOnce(() => Promise.resolve(
        mockResponse(true, 200, {})
      ));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.forgotPassword("test@example.com");
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/auth/forgot-password",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify({ email: "test@example.com" })
        })
      );
    });
  });

  describe("resetPassword", () => {
    it("should call the reset password endpoint", async () => {
      const token = "reset-token";
      mockFetch.mockImplementationOnce(() => Promise.resolve(
        mockResponse(true, 200, {})
      ));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.resetPassword(token, "newpassword");
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/auth/reset-password",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify({ token, password: "newpassword" })
        })
      );
    });
  });

  describe("updateUser", () => {
    it("should update the user in context", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      const updatedUser = { ...testUser, name: "Updated Name" };
      act(() => {
        result.current.updateUser(updatedUser);
      });

      expect(result.current.user).toEqual(updatedUser);
    });
  });
});