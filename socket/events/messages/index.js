
// eslint-disable-next-line no-unused-vars
const handleWsMessagesEvents = ({ socket, io }) => {
  socket.on('msg', msg => {
    socket.emit('msg-received', `message received, ${msg}`);
  });
};

module.exports = { handleWsMessagesEvents };
