package com.nr.synergysphere.task.dto.request;

import com.nr.synergysphere.task.model.TaskStatus;
import lombok.Data;

@Data
public class UpdateTaskStatusRequest {
    private TaskStatus status;
}
