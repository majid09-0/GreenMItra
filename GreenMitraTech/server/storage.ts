import { type User, type InsertUser, type Report, type InsertReport, type Reward, type InsertReward } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: string, points: number): Promise<User | undefined>;
  
  // Report operations
  createReport(report: InsertReport): Promise<Report>;
  getReportsByUser(userId: string): Promise<Report[]>;
  getReportsByZone(zone: string): Promise<Report[]>;
  getAllReports(): Promise<Report[]>;
  updateReportStatus(reportId: string, status: "pending" | "verified" | "rejected", verifiedBy?: string): Promise<Report | undefined>;
  
  // Reward operations
  getRewards(): Promise<Reward[]>;
  redeemReward(userId: string, rewardId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private reports: Map<string, Report>;
  private rewards: Map<string, Reward>;

  constructor() {
    this.users = new Map();
    this.reports = new Map();
    this.rewards = new Map();
    this.initializeRewards();
  }

  private initializeRewards() {
    const defaultRewards: Reward[] = [
      {
        id: randomUUID(),
        name: "₹50 Electricity Bill Discount",
        description: "Valid for 30 days",
        cost: 50,
        type: "electricity"
      },
      {
        id: randomUUID(),
        name: "₹100 Water Bill Discount", 
        description: "Valid for 30 days",
        cost: 75,
        type: "water"
      },
      {
        id: randomUUID(),
        name: "₹150 Shopping Voucher",
        description: "Local grocery stores",
        cost: 100,
        type: "voucher"
      },
      {
        id: randomUUID(),
        name: "Plant a Tree Certificate",
        description: "Environmental contribution",
        cost: 150,
        type: "tree"
      }
    ];

    defaultRewards.forEach(reward => {
      this.rewards.set(reward.id, reward);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      greenPoints: insertUser.userType === 'citizen' ? 25 : 0, // Starting bonus for citizens
      createdAt: new Date(),
      userType: insertUser.userType as "citizen" | "champion" | "admin",
      address: insertUser.address || null,
      zone: insertUser.zone || null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(userId: string, points: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      const updatedUser = { ...user, greenPoints: (user.greenPoints || 0) + points };
      this.users.set(userId, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = randomUUID();
    const report: Report = {
      ...insertReport,
      id,
      status: "pending",
      createdAt: new Date(),
      verifiedBy: null,
      type: insertReport.type as "dumping" | "segregation" | "composting",
      description: insertReport.description || null,
      points: 0,
    };
    this.reports.set(id, report);
    return report;
  }

  async getReportsByUser(userId: string): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(report => report.userId === userId);
  }

  async getReportsByZone(zone: string): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(report => {
      const user = this.users.get(report.userId);
      return user?.zone === zone;
    });
  }

  async getAllReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }

  async updateReportStatus(reportId: string, status: "pending" | "verified" | "rejected", verifiedBy?: string): Promise<Report | undefined> {
    const report = this.reports.get(reportId);
    if (report) {
      const updatedReport = { ...report, status, verifiedBy: verifiedBy || null };
      this.reports.set(reportId, updatedReport);
      
      // Award points if verified
      if (status === "verified") {
        const pointsMap = {
          "dumping": 10,
          "segregation": 15,
          "composting": 20
        };
        const points = pointsMap[report.type] || 10;
        await this.updateUserPoints(report.userId, points);
        updatedReport.points = points;
        this.reports.set(reportId, { ...updatedReport, verifiedBy: verifiedBy || null });
      }
      
      return updatedReport;
    }
    return undefined;
  }

  async getRewards(): Promise<Reward[]> {
    return Array.from(this.rewards.values());
  }

  async redeemReward(userId: string, rewardId: string): Promise<boolean> {
    const user = this.users.get(userId);
    const reward = this.rewards.get(rewardId);
    
    if (user && reward && (user.greenPoints || 0) >= reward.cost) {
      await this.updateUserPoints(userId, -reward.cost);
      return true;
    }
    return false;
  }
}

export const storage = new MemStorage();
