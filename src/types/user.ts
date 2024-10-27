export type UserType = "ADMIN" | "HEALTH_PROMOTION" | "SUS" | "ASSISTANCE" | "ILPI" | "CT";

export interface User {
	id: string;
	email: string;
	type: UserType;
	createdAt: Date;
}
