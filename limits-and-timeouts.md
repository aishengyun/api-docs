# Concurrency Limits and Timeout Details

## Concurrency Management

### **Concurrency Calculation**

- **WebSocket**: Calculated based on the number of active `context_id`s.  
  - Multiple requests under the same `context_id` are treated as a single concurrent task.  
- **HTTP Requests**: Each individual request counts as one concurrent task.  

### **Handling Limit Exceedance**

If the concurrency limit is exceeded, the system returns a `429 Too Many Requests` error response.

---

## Recommendations for Specific Scenarios

### **Real-Time Conversation Scenarios**

- The actual number of supported parallel conversations is approximately **4 times** the concurrency limit.  
  - **Example**: A concurrency limit of 10 supports about 40 parallel conversations.  
- The exact capacity depends on the type of conversation. For precise assessments, contact us to evaluate your requirements.

### **Batch Processing Scenarios**

- The concurrency limit corresponds directly to the number of tasks processed simultaneously.  
  - **Example**: A concurrency limit of 15 allows for 15 simultaneous audio generation tasks.  
- Use a connection pool to control the number of concurrent tasks efficiently.

---

## WebSocket Connection Management

### **Timeout Mechanism**

- Idle connections are automatically closed after **5 minutes** of inactivity.  

#### **Maintaining Long Connections**
- Send periodic requests to keep the connection active.  
- Set an appropriate heartbeat interval based on your business needs.

---

## Best Practices

1. **Plan Concurrency Usage**  
   - Ensure efficient use of concurrency resources by balancing real-time and batch requests.  

2. **Implement Retry Mechanisms**  
   - Handle `429 Too Many Requests` errors by implementing a backoff and retry strategy.

3. **Monitor Connection States**  
   - Regularly check and log the status of WebSocket connections.  

4. **Handle Timeouts and Reconnection**  
   - Reconnect promptly if a connection times out or is closed unexpectedly.