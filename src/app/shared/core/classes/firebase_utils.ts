import { Injectable } from '@angular/core';
import {
    Storage,
    getDownloadURL,
    ref,
    uploadBytesResumable,
} from '@angular/fire/storage';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    
    constructor(private storage: Storage) {}

    async uploadFile(file: File, path: string): Promise<string> {
        const storageRef = ref(this.storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise<string>((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                null,
                (error) => reject(error),
                async () => {
                    const downloadURL = await getDownloadURL(
                        uploadTask.snapshot.ref
                    );
                    resolve(downloadURL);
                }
            );
        });
    }
}
