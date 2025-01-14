const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser()); // 쿠키 파싱 미들웨어 추가
const io = new Server(server);

const users = new Map(); // 사용자 목록 (socket.id와 사용자 이름 매핑)

app.use(express.static(path.join(__dirname, "dist")));

// 로그인 API: ID를 쿠키에 저장
app.post("/login", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  // ID를 쿠키에 저장 (유효 기간 1시간)
  res.cookie("user_id", id, { maxAge: 60 * 60 * 1000, httpOnly: true });
  res.json({ message: "Login successful, ID saved in cookie." });
});

// 미들웨어: WebSocket 인증
io.use((socket, next) => {
  const cookies = socket.handshake.headers.cookie;
  if (!cookies) {
    return next(new Error("No cookies found"));
  }

  const cookiePairs = cookies.split(";").map((cookie) => cookie.trim());
  const userCookie = cookiePairs.find((c) => c.startsWith("user_id="));

  if (!userCookie) {
    return next(new Error("User ID cookie is missing"));
  }

  const userId = userCookie.split("=")[1];
  socket.userId = userId; // socket에 사용자 ID 추가
  next();
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // WebSocket 연결 시 쿠키로 사용자 ID 가져오기
  const userId = socket.userId;
  users.set(socket.id, userId);

  console.log(`${userId} connected with ID: ${socket.id}`);

  // 연결된 사용자 목록 전송
  io.emit("user_list", Array.from(users.values()));

  // 채팅 메시지 수신
  socket.on("chat_message", (data) => {
    const username = users.get(socket.id) || "Unknown User";
    console.log(`Message from ${username}: ${data.message}`);

    // 메시지 전송 (모든 사용자에게 브로드캐스트)
    io.emit("chat_response", { message: data.message, sender: username });
  });

  // 연결 해제 처리
  socket.on("disconnect", () => {
    const username = users.get(socket.id) || "Unknown User";
    console.log(`${username} disconnected.`);
    users.delete(socket.id);

    // 연결된 사용자 목록 갱신
    io.emit("user_list", Array.from(users.values()));
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
