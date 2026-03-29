package com.ecommerce.ecommerceapp

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableAsync

@SpringBootApplication
@EnableAsync
class EcommerceAppApplication

fun main(args: Array<String>) {
    runApplication<EcommerceAppApplication>(*args)
}
