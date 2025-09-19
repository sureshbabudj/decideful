import {
  Zap,
  Search,
  Target,
  Briefcase,
  Heart,
  DollarSign,
  Users,
} from "lucide-react";
import {
  CategoryType,
  DecisionInput,
  DecisionType,
  ReviewFrequencyType,
} from "@/lib/schemas/decision.schema";

export interface TemplateType {
  id: string;
  title: string;
  description: string;
  formData: DecisionInput;
}

export interface CategoryTemplateType {
  id: string;
  category: string;
  icon: typeof Briefcase;
  templates: TemplateType[];
}

export const templates = [
  {
    id: "quick",
    title: "Quick Decision",
    description: "For straightforward choices that need a fast resolution.",
    icon: Zap,
    color: "text-yellow-600 bg-yellow-100",
    questions: [
      "What are your options?",
      "What's your gut feeling?",
      "When do you need to decide?",
    ],
  },
  {
    id: "detailed",
    title: "Detailed Analysis",
    description:
      "For decisions that require careful consideration of pros and cons.",
    icon: Search,
    color: "text-blue-600 bg-blue-100",
    questions: [
      "What's the context?",
      "What are all possible options?",
      "What are the pros and cons?",
      "What's the expected outcome?",
    ],
  },
  {
    id: "complex",
    title: "Complex Decision",
    description:
      "For high-stakes decisions with multiple variables and outcomes.",
    icon: Target,
    color: "text-purple-600 bg-purple-100",
    questions: [
      "What's the problem statement?",
      "What are the constraints?",
      "Who are the stakeholders?",
      "What are the risk factors?",
      "What's the decision criteria?",
    ],
  },
];

export const categoryTemplates: CategoryTemplateType[] = [
  {
    id: "work",
    category: "Career",
    icon: Briefcase,
    templates: [
      {
        id: "work-0",
        title: "Job Offer Evaluation",
        description: "Compare job offers and career opportunities",
        formData: {
          title: "Job Offer Evaluation",
          context: "I would like to evaluate two job offers I have received.",
          expectedOutcome:
            "To choose the best job offer based on my priorities.",
          type: "detailed" as DecisionType,
          category: "work" as CategoryType,
          options: [
            { id: "1", text: "Accept Offer from Company A", selected: false },
            { id: "2", text: "Accept Offer from Company B", selected: false },
            { id: "3", text: "Negotiate for better terms", selected: false },
            { id: "4", text: "Decline both offers", selected: false },
          ],
          reviewReminder: "1 month" as ReviewFrequencyType,
        },
      },
      {
        id: "work-1",
        title: "Skill Development",
        description: "Choose which skills to invest in learning",
        formData: {
          title: "Skill Development",
          context:
            "I want to decide which new skills to learn for my career growth.",
          expectedOutcome: "To select the most valuable skills to focus on.",
          type: "detailed" as DecisionType,
          category: "work" as CategoryType,
          options: [
            {
              id: "1",
              text: "Learn Data Analysis (Excel, SQL)",
              selected: false,
            },
            { id: "2", text: "Improve Public Speaking", selected: false },
            {
              id: "3",
              text: "Get Certified in Project Management",
              selected: false,
            },
            {
              id: "4",
              text: "Learn a Programming Language (Python, JavaScript)",
              selected: false,
            },
            { id: "5", text: "Develop Leadership Skills", selected: false },
          ],
          reviewReminder: "6 months" as ReviewFrequencyType,
        },
      },
      {
        id: "work-2",
        title: "Work-Life Balance",
        description: "Make decisions about work schedule and commitments",
        formData: {
          title: "Work-Life Balance",
          context:
            "I need to decide how to balance my work commitments with personal life.",
          expectedOutcome: "To create a sustainable work-life balance plan.",
          type: "detailed" as DecisionType,
          category: "work" as CategoryType,
          options: [
            { id: "1", text: "Switch to Remote Work", selected: false },
            { id: "2", text: "Reduce Working Hours", selected: false },
            { id: "3", text: "Take a Sabbatical", selected: false },
            { id: "4", text: "Maintain Current Schedule", selected: false },
          ],
          reviewReminder: "3 months" as ReviewFrequencyType,
        },
      },
    ],
  },
  {
    id: "finance",
    category: "Finance",
    icon: DollarSign,
    templates: [
      {
        id: "finance-1",
        title: "Investment Decision",
        description: "Evaluate investment opportunities",
        formData: {
          title: "Investment Decision",
          context: "I want to decide where to invest my savings.",
          expectedOutcome: "To choose the best investment option.",
          type: "detailed" as DecisionType,
          category: "finance" as CategoryType,
          options: [
            { id: "1", text: "Invest in Cryptocurrency", selected: false },
            { id: "2", text: "Invest in Index Funds", selected: false },
            { id: "3", text: "Invest in Real Estate", selected: false },
            {
              id: "4",
              text: "Keep Savings in High-Yield Account",
              selected: false,
            },
          ],
          reviewReminder: "3 months" as ReviewFrequencyType,
        },
      },
      {
        id: "finance-2",
        title: "Major Purchase",
        description: "Decide on large purchases like cars or appliances",
        formData: {
          title: "Major Purchase",
          context: "I need to decide on buying a new car or appliance.",
          expectedOutcome: "To make a well-informed purchase decision.",
          type: "detailed" as DecisionType,
          category: "finance" as CategoryType,
          options: [
            {
              id: "1",
              text: "Buy a New Car (e.g. Toyota Camry)",
              selected: false,
            },
            { id: "2", text: "Buy a Used Car", selected: false },
            {
              id: "3",
              text: "Buy a Double-Door Refrigerator",
              selected: false,
            },
            { id: "4", text: "Postpone Purchase", selected: false },
          ],
          reviewReminder: "1 month" as ReviewFrequencyType,
        },
      },
      {
        id: "finance-3",
        title: "Budget Allocation",
        description: "Determine how to allocate your budget",
        formData: {
          title: "Budget Allocation",
          context: "I want to decide how to allocate my monthly budget.",
          expectedOutcome: "To create an effective budget allocation plan.",
          type: "detailed" as DecisionType,
          category: "finance" as CategoryType,
          options: [
            { id: "1", text: "Increase Savings", selected: false },
            { id: "2", text: "Reduce Dining Out Expenses", selected: false },
            {
              id: "3",
              text: "Allocate More to Entertainment",
              selected: false,
            },
            { id: "4", text: "Reduce Utility Bills", selected: false },
          ],
          reviewReminder: "1 month" as ReviewFrequencyType,
        },
      },
    ],
  },
  {
    id: "health",
    category: "Health",
    icon: Heart,
    templates: [
      {
        id: "health-1",
        title: "Health Insurance Options",
        description: "Choose between different medical plans",
        formData: {
          title: "Health Insurance Options",
          context:
            "I need to decide on the best Health Insurance Plan for my health condition.",
          expectedOutcome:
            "To select the most effective Health Insurance plan.",
          type: "detailed" as DecisionType,
          category: "health" as CategoryType,
          options: [
            {
              id: "1",
              text: "Private Health Insurance (e.g. Blue Cross)",
              selected: false,
            },
            {
              id: "2",
              text: "Public Health Insurance (e.g. Medicaid)",
              selected: false,
            },
            { id: "3", text: "Employer-Provided Insurance", selected: false },
            { id: "4", text: "No Insurance", selected: false },
          ],
          reviewReminder: "3 months" as ReviewFrequencyType,
        },
      },
      {
        id: "health-2",
        title: "Lifestyle Changes",
        description: "Decide on diet, exercise, or habit changes",
        formData: {
          title: "Lifestyle Changes",
          context: "I want to decide on lifestyle changes for better health.",
          expectedOutcome: "To implement effective lifestyle changes.",
          type: "detailed" as DecisionType,
          category: "health" as CategoryType,
          options: [
            { id: "1", text: "Adopt a Mediterranean Diet", selected: false },
            { id: "2", text: "Exercise 5 Days a Week", selected: false },
            { id: "3", text: "Quit Smoking", selected: false },
            { id: "4", text: "Reduce Screen Time", selected: false },
          ],
          reviewReminder: "3 months" as ReviewFrequencyType,
        },
      },
      {
        id: "health-3",
        title: "Healthcare Providers",
        description: "Select doctors or healthcare plans",
        formData: {
          title: "Healthcare Providers",
          context: "I need to choose a new healthcare provider or plan.",
          expectedOutcome: "To select the best healthcare option.",
          type: "detailed" as DecisionType,
          category: "health" as CategoryType,
          options: [
            {
              id: "1",
              text: "Dr. Smith (General Practitioner)",
              selected: false,
            },
            { id: "2", text: "Dr. Lee (Specialist)", selected: false },
            { id: "3", text: "Local Health Clinic", selected: false },
            { id: "4", text: "Telemedicine Provider", selected: false },
          ],
          reviewReminder: "6 months" as ReviewFrequencyType,
        },
      },
    ],
  },
  {
    id: "relationships",
    category: "Relationships",
    icon: Users,
    templates: [
      {
        id: "relationships-1",
        title: "Moving In Together",
        description: "Decide when and where to move in together",
        formData: {
          title: "Moving In Together",
          context: "My partner and I are considering moving in together.",
          expectedOutcome:
            "To make a well-informed decision about cohabitation.",
          type: "detailed" as DecisionType,
          category: "relationships" as CategoryType,
          options: [
            { id: "1", text: "Move in now", selected: false },
            { id: "2", text: "Wait 6 months", selected: false },
            { id: "3", text: "Find a new apartment together", selected: false },
            { id: "4", text: "Continue living separately", selected: false },
          ],
          reviewReminder: "1 month" as ReviewFrequencyType,
        },
      },
      {
        id: "relationships-2",
        title: "Conflict Resolution",
        description: "Choose how to handle relationship conflicts",
        formData: {
          title: "Conflict Resolution",
          context:
            "I need to decide the best approach to resolve a conflict in my relationship.",
          expectedOutcome: "To find a constructive resolution method.",
          type: "detailed" as DecisionType,
          category: "relationships" as CategoryType,
          options: [
            { id: "1", text: "Have an open conversation", selected: false },
            { id: "2", text: "Seek couple therapy", selected: false },
            { id: "3", text: "Take a break from each other", selected: false },
            { id: "4", text: "End the relationship", selected: false },
          ],
          reviewReminder: "2 weeks" as ReviewFrequencyType,
          confidence: 70,
        },
      },
      {
        id: "relationships-3",
        title: "Major Life Changes",
        description: "Make decisions that affect your relationship",
        formData: {
          title: "Major Life Changes",
          context:
            "My partner and I are considering a major life change together.",
          expectedOutcome: "To make a decision that benefits our relationship.",
          type: "detailed" as DecisionType,
          category: "relationships" as CategoryType,
          options: [
            { id: "1", text: "Move to a new city together", selected: false },
            { id: "2", text: "Start a family", selected: false },
            { id: "3", text: "Buy a house together", selected: false },
            { id: "4", text: "Travel long-term together", selected: false },
          ],
          reviewReminder: "1 month" as ReviewFrequencyType,
        },
      },
    ],
  },
];
