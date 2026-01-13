import fs from "node:fs";

class FileExtensionUtil {
    public readDataFromJson(filePath: string) {
        return JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));
    }
}

export const onFileExtensionUtil: FileExtensionUtil = new FileExtensionUtil();
