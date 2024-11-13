package errors

import "errors"

var (
    ErrInvalidGameID   = errors.New("invalid game ID")
    ErrGameNotFound    = errors.New("game not found")
    ErrInvalidUsername = errors.New("invalid username")
    ErrInvalidScore    = errors.New("invalid score")
    ErrSaveFailed      = errors.New("failed to save data")
)