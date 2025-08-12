module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user to their personal room
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join camp room for real-time updates
    socket.on('join-camp', (campId) => {
      socket.join(`camp_${campId}`);
      console.log(`User joined camp room: ${campId}`);
    });

    // Handle chat messages
    socket.on('send-message', (data) => {
      const { recipientId, message, senderId } = data;
      
      // Send to recipient
      io.to(`user_${recipientId}`).emit('new-message', {
        senderId,
        content: message,
        timestamp: new Date()
      });

      // Send confirmation to sender
      socket.emit('message-sent', {
        recipientId,
        content: message,
        timestamp: new Date()
      });
    });

    // Handle camp session updates
    socket.on('session-update', (data) => {
      const { campId, sessionData } = data;
      io.to(`camp_${campId}`).emit('session-updated', sessionData);
    });

    // Handle notifications
    socket.on('send-notification', (data) => {
      const { recipientId, notification } = data;
      io.to(`user_${recipientId}`).emit('new-notification', notification);
    });

    // Handle typing indicators
    socket.on('typing-start', (data) => {
      const { recipientId, senderId } = data;
      io.to(`user_${recipientId}`).emit('user-typing', { senderId, isTyping: true });
    });

    socket.on('typing-stop', (data) => {
      const { recipientId, senderId } = data;
      io.to(`user_${recipientId}`).emit('user-typing', { senderId, isTyping: false });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};