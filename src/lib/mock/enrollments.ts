type Enrollment = {
  id: string;
  studentName: string;
  email: string;
  program: string;
  enrollmentDate: string;
  status: "active" | "pending" | "completed" | "cancelled";
  paymentStatus: "paid" | "pending" | "failed";
  amount: number;
};

export const mockEnrollments: Enrollment[] = [
  {
    id: "ENR001",
    studentName: "John Doe",
    email: "john.doe@example.com",
    program: "Yoga Fundamentals",
    enrollmentDate: "2024-01-15",
    status: "active",
    paymentStatus: "paid",
    amount: 299.99,
  },
  {
    id: "ENR002",
    studentName: "Jane Smith",
    email: "jane.smith@example.com",
    program: "Meditation Master Class",
    enrollmentDate: "2024-01-20",
    status: "active",
    paymentStatus: "paid",
    amount: 199.99,
  },
  {
    id: "ENR003",
    studentName: "Mike Johnson",
    email: "mike.johnson@example.com",
    program: "Nutrition Basics",
    enrollmentDate: "2024-02-01",
    status: "pending",
    paymentStatus: "pending",
    amount: 149.99,
  },
  {
    id: "ENR004",
    studentName: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    program: "Fitness Boot Camp",
    enrollmentDate: "2024-02-10",
    status: "active",
    paymentStatus: "paid",
    amount: 399.99,
  },
  {
    id: "ENR005",
    studentName: "David Brown",
    email: "david.brown@example.com",
    program: "Mindfulness Workshop",
    enrollmentDate: "2024-02-15",
    status: "cancelled",
    paymentStatus: "failed",
    amount: 89.99,
  },
  {
    id: "ENR006",
    studentName: "Emily Davis",
    email: "emily.davis@example.com",
    program: "Holistic Health Course",
    enrollmentDate: "2024-03-01",
    status: "completed",
    paymentStatus: "paid",
    amount: 599.99,
  },
];
