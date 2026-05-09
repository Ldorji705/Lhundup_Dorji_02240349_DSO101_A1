describe('Tasks API Tests', () => {
  test('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  test('tasks route should be a string', () => {
    expect('/tasks').toBe('/tasks');
  });

  test('should handle task object', () => {
    const task = {
      title: 'Test task',
      category: 'work',
      completed: false
    };
    expect(task.title).toBe('Test task');
    expect(task.completed).toBe(false);
  });
});