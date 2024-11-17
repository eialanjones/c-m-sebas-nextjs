export type UserType = "ADMIN" | "HEALTH_PROMOTION" | "SUS" | "ASSISTANCE" | "ILPI" | "CT";

export interface User {
	id: string;
	email: string;
	userType: UserType;
	password: string;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}
