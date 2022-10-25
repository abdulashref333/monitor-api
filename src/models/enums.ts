export enum Protocols {
  HTTP = "http",
  HTTPS = "https",
  TCP = "tcp",
}

export enum Schedules {
  PING_SCHEDULE = "Ping Scheduling",
  REPORT_SCHEDULE = "Report Scheduling",
}

export enum Status {
  DOWN = "down",
  UP = "up",
}

export enum Defaults {
  TIMEOUT = 5000,
  REPORT_SCHEDULE_INTERVAL = "1 minutes",
  // errors messages.
  AGENDA_ERROR = "Agenda Error: ",
  MONGO_DB_ERROR = "MogoDB Error: ",
  REDIS_DB_ERROR = "Redis Error: ",
}
