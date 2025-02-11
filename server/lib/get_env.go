package lib

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

func GetEnv(key string, valueType string) (interface{}, error) {
	value := os.Getenv(key)
	if value == "" {
		return nil, fmt.Errorf("environment variable %s not set", key)
	}

	switch valueType {
	case "string":
		return value, nil
	case "int":
		return strconv.Atoi(value)
	case "bool":
		return strconv.ParseBool(value)
	case "duration":
		// If the value is a plain number, treat it as seconds
		if _, err := strconv.Atoi(value); err == nil {
			value += "s"
		}
		return time.ParseDuration(value)
	default:
		return nil, fmt.Errorf("unsupported value type: %s", valueType)
	}
}
