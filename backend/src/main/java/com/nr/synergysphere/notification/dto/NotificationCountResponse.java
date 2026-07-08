package com.nr.synergysphere.notification.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationCountResponse {
    private long count;
    //future if you want to put last read and all so dto

}
