import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

interface ConnectedClient {
  id: string;
  ws: WebSocket;
  lastPing: Date;
  subscriptions: Set<string>;
}

export class GymWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, ConnectedClient> = new Map();
  private pingInterval: NodeJS.Timeout;

  constructor(server: Server, port: number = 4001) {
    this.wss = new WebSocketServer({ 
      port,
      perMessageDeflate: false,
    });

    this.setupWebSocketServer();
    this.startPingInterval();

    console.log(`🔗 WebSocket server started on port ${port}`);
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, request) => {
      const clientId = this.generateClientId();
      const client: ConnectedClient = {
        id: clientId,
        ws,
        lastPing: new Date(),
        subscriptions: new Set(),
      };

      this.clients.set(clientId, client);
      console.log(`📱 Client connected: ${clientId} (Total: ${this.clients.size})`);

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'connection_established',
        payload: { clientId, serverTime: new Date().toISOString() },
        timestamp: new Date().toISOString(),
      });

      // Handle incoming messages
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(clientId, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`📱 Client disconnected: ${clientId} (Total: ${this.clients.size})`);
      });

      // Handle WebSocket errors
      ws.on('error', (error) => {
        console.error(`❌ WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });

      // Handle pong responses
      ws.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) {
          client.lastPing = new Date();
        }
      });
    });
  }

  private handleClientMessage(clientId: string, message: any) {
    const { type, payload } = message;

    switch (type) {
      case 'subscribe':
        this.handleSubscription(clientId, payload.events);
        break;
      case 'unsubscribe':
        this.handleUnsubscription(clientId, payload.events);
        break;
      case 'ping':
        this.sendToClient(clientId, {
          type: 'pong',
          payload: { serverTime: new Date().toISOString() },
          timestamp: new Date().toISOString(),
        });
        break;
      default:
        console.log(`Unknown message type: ${type}`);
    }
  }

  private handleSubscription(clientId: string, events: string[]) {
    const client = this.clients.get(clientId);
    if (client) {
      events.forEach(event => client.subscriptions.add(event));
      console.log(`📡 Client ${clientId} subscribed to: ${events.join(', ')}`);
    }
  }

  private handleUnsubscription(clientId: string, events: string[]) {
    const client = this.clients.get(clientId);
    if (client) {
      events.forEach(event => client.subscriptions.delete(event));
      console.log(`📡 Client ${clientId} unsubscribed from: ${events.join(', ')}`);
    }
  }

  private sendToClient(clientId: string, message: WebSocketMessage) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Error sending message to client ${clientId}:`, error);
      }
    }
  }

  // Public methods for broadcasting updates
  public broadcastToSubscribers(eventType: string, data: any) {
    const message: WebSocketMessage = {
      type: eventType,
      payload: data,
      timestamp: new Date().toISOString(),
    };

    this.clients.forEach((client, clientId) => {
      if (client.subscriptions.has(eventType)) {
        this.sendToClient(clientId, message);
      }
    });

    console.log(`📡 Broadcasted ${eventType} to ${Array.from(this.clients.values()).filter(c => c.subscriptions.has(eventType)).length} subscribers`);
  }

  public broadcastSystemUpdate(updateType: 'member_stats' | 'system_health' | 'new_member' | 'new_payment' | 'equipment_status', data: any) {
    this.broadcastToSubscribers(updateType, data);
  }

  private startPingInterval() {
    this.pingInterval = setInterval(() => {
      const now = new Date();
      this.clients.forEach((client, clientId) => {
        // Check if client is still responsive (last ping within 60 seconds)
        if (now.getTime() - client.lastPing.getTime() > 60000) {
          console.log(`⚠️ Client ${clientId} appears inactive, removing...`);
          client.ws.terminate();
          this.clients.delete(clientId);
        } else if (client.ws.readyState === WebSocket.OPEN) {
          // Send ping
          client.ws.ping();
        }
      });
    }, 30000); // Check every 30 seconds
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }

  public getClientSubscriptions(clientId: string): string[] {
    const client = this.clients.get(clientId);
    return client ? Array.from(client.subscriptions) : [];
  }

  public close() {
    clearInterval(this.pingInterval);
    this.wss.close();
    console.log('🔌 WebSocket server closed');
  }
}

export default GymWebSocketServer;
