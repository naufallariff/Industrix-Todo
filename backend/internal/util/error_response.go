package util

import (
	"github.com/gin-gonic/gin"
)

// APIError represents a standardized error response for the API.
type APIError struct {
	Error   string `json:"error"`
	Details string `json:"details,omitempty"`
}

// ErrorResponse sends a standardized JSON error response to the client.
func ErrorResponse(c *gin.Context, httpStatus int, message string, details ...string) {
	errDetails := ""
	if len(details) > 0 {
		errDetails = details[0]
	}
	
	c.JSON(httpStatus, APIError{
		Error:   message,
		Details: errDetails,
	})
}