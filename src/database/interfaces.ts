export interface DBSession {
  startTransaction: () => void;
  commitTransaction: () => Promise<void>;
  abortTransaction: () => Promise<void>;
  endSession: () => void;
}

export interface DatabaseConnection {
  startSession: () => Promise<DBSession>;
}