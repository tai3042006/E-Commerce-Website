package com.clofit.controller;

public class ApiResponse<T> {

    private final int status;
    private final boolean success;
    private final String message;
    private final T data;

    public ApiResponse(int status, boolean success, String message, T data) {
        this.status = status;
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public static <T> ApiResponse<T> ok(T data, String msg) {
        return new ApiResponse<>(200, true, msg, data);
    }

    public static <T> ApiResponse<T> created(T data, String msg) {
        return new ApiResponse<>(201, true, msg, data);
    }

    public static <T> ApiResponse<T> badRequest(String msg) {
        return new ApiResponse<>(400, false, msg, null);
    }

    public static <T> ApiResponse<T> notFound(String msg) {
        return new ApiResponse<>(404, false, msg, null);
    }

    public int getStatus() {
        return status;
    }

    public String toJson() {

    String jsonData;

    if (data == null) {
        jsonData = "null";

    } else if (data instanceof String) {

        jsonData = "\"" + data + "\"";

    } else {

        jsonData = data.toString();
    }

    return String.format("""
        {
          "status": %d,
          "success": %b,
          "message": "%s",
          "data": %s
        }
        """,
        status,
        success,
        message,
        jsonData
    );
}