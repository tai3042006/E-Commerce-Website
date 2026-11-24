# CloFit

CloFit dùng React và Vite cho giao diện, Java 21 và Spring Boot cho API, cùng MySQL để lưu dữ liệu. API Java dùng các model và factory trong `Website/src/main/java/com/clofit/backend`. Thư mục `Website/server` lưu backend Express cũ để đối chiếu.

## Chạy trên máy local

1. Cài Java 21, Maven, Node.js 22.12 trở lên và mở MySQL hoặc MariaDB. Chạy các lệnh từ thư mục `Website`.
2. Trong PowerShell, đặt các biến cần thiết trước khi chạy backend. Mặc định Java dùng `127.0.0.1:3306`, database `clofit`, người dùng `root` và mật khẩu rỗng. Danh sách biến có trong `.env.example`. Spring Boot đọc biến từ môi trường của tiến trình.
3. Chạy `mvn package` rồi `java -jar target/clofit-api-1.0.0.jar`. Mở `http://localhost:4000/health` để kiểm tra API.
4. Trong terminal khác, chạy `npm ci` và `npm run dev`. Mở `http://localhost:8080`.

Dùng `ADMIN_EMAIL` và `ADMIN_PASSWORD` để tạo tài khoản admin khi khởi động lần đầu. Đăng ký tài khoản khách tại `/signup`. Lần chạy đầu có thể nạp danh mục mẫu. Đặt `SEED_CATALOG=false` nếu muốn nhập sản phẩm của cửa hàng từ trang admin.

Có thể dùng `docker compose up --build` để chạy MySQL, API Java và frontend local. Compose đưa cổng MySQL ra local tại `3307`.

## Triển khai frontend lên Vercel

1. Triển khai Dockerfile trong `Website` lên dịch vụ chạy container Java. Cấu hình MySQL trên dịch vụ đó với `JDBC_DATABASE_URL`, `DB_USER`, `DB_PASSWORD` và cấu hình TLS theo nhà cung cấp. Dùng một database riêng cho môi trường production. Kiểm tra endpoint HTTPS `/health` trước khi nối frontend.
2. Import repo vào Vercel. Đặt **Root Directory** là `Website` và **Framework Preset** là Vite. Trong Environment Variables, đặt `JAVA_API_URL` bằng origin HTTPS của Java, ví dụ `https://api.example.com`. Không thêm `/api` vào cuối origin.
3. Deploy. `vercel.ts` chuyển tiếp `/api/*` và `/health` đến Java. Các route React như `/checkout` và `/account` mở trực tiếp được qua cấu hình SPA.
4. Mở `/health` trên domain Vercel. Sau đó kiểm tra đăng ký, đăng nhập, tải danh mục và quay lại checkout bằng một link trực tiếp.

## Kết nối VietQR qua payOS

Đặt các biến sau trong dịch vụ **Java**.

| Biến | Giá trị |
|---|---|
| `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY` | Thông tin của kênh nhận tiền payOS |
| `STORE_URL` | Origin HTTPS của frontend Vercel hoặc domain cửa hàng |
| `USD_VND_RATE` | Tỷ giá VND trên 1 USD do cửa hàng cấu hình. Danh mục hiện niêm yết USD và mã VietQR nhận VND. |

Trong dashboard payOS, đăng ký webhook `https://<domain-java>/api/payments/payos/webhook`. API đọc giá từ MySQL, tính tổng đơn, lưu số tiền VND cố định và tạo QR. Checkout chỉ xác nhận thanh toán khi Java đối chiếu số tiền, mã đơn, mã thanh toán và trạng thái với payOS. Các lần gửi lại webhook chỉ ghi nhận một giao dịch.

Điểm tích hợp nằm tại `PayOsClient.java`. Các route tạo và tra cứu link cùng webhook nằm tại `PaymentApi.java`. Đổi cổng thanh toán ở hai file này. Các trang frontend tiếp tục gọi `/api/orders/{id}/payment`.

Để dùng chức năng quên mật khẩu, khai báo SMTP bằng các biến `SPRING_MAIL_*` và `MAIL_FROM` trong `.env.example`.

## Kiểm tra

- Frontend: `npm run build`, `npm run lint`, `npm test`.
- Backend: `mvn package` và `GET /health`.
- Sau khi cấu hình kênh thanh toán, kiểm tra một giao dịch thật do chủ cửa hàng thực hiện và xác nhận webhook đã ghi nhận đủ tiền trước khi mở checkout cho khách.
