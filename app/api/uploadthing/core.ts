import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { auth } from "@/auth";

const f = createUploadthing();

export const ourFileRouter = {
  companyLogoUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth();

      if (!session?.teamId) {
        throw new UploadThingError("Unauthorized");
      }

      return {
        teamId: session.teamId,
      };
    })
    .onUploadComplete(
      async ({
        metadata,
        file,
      }: {
        metadata: { teamId: string };
        file: { ufsUrl: string; key: string };
      }) => {
        return {
          uploadedByTeamId: metadata.teamId,
          url: file.ufsUrl,
          key: file.key,
        };
      }
    ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
