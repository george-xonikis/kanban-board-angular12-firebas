import { Injectable } from '@angular/core';
import { Board, Task } from './board.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { AuthService } from '../user/auth.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BoardService {
    constructor(private authService: AuthService,
                private db: AngularFirestore) {
    }

    /**
     * Get all boards owned by current user
     */
    get boards$(): Observable<Board[]> {
        const user = this.authService.user;
        return this.db
            .collection<Board>('boards', ref =>
                ref.where('uid', '==', user?.uid).orderBy('priority')
            )
            .valueChanges({ idField: 'id' });
    }


    /**
     * Creates a new board for the current user
     */
    createBoard(data: Board) {
        const user = this.authService.user;

        this.db.collection('boards').add({
            ...data,
            uid: user?.uid,
        });
    }

    /**
     * Run a batch write to change the priority of each board for sorting
     */
    sortBoards(boards: Board[]) {
        const firestore = firebase.firestore();
        const batch = firestore.batch();
        const refs = boards.map(board => firestore.collection('boards').doc(board.id));

        refs.forEach((ref, idx) => batch.update(ref, { priority: idx }));
        batch.commit();
    }

    /**
     * Updates the tasks on board
     */
    updateTasks(tasks: Task[], boardId?: string) {
        return this.db
            .collection('boards')
            .doc(boardId)
            .update({ tasks });
    }

    /**
     * Remove a specifc task from the board
     */
    removeTask(boardId: string, task: Task) {
        return this.db
            .collection('boards')
            .doc(boardId)
            .update({
                tasks: firebase.firestore.FieldValue.arrayRemove(task)
            });
    }

    /**
     * Delete board
     */
    deleteBoard(boardId: string) {
        return this.db
            .collection('boards')
            .doc(boardId)
            .delete();
    }


}
