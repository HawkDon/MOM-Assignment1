
import com.rabbitmq.client.ConnectionFactory
import com.rabbitmq.client.Delivery
import java.nio.charset.Charset

const val TO_SERVER = "TO_SERVER"
const val TO_CLIENT = "TO_CLIENT"

fun main() {
    val factory = ConnectionFactory()
    val connection = factory.newConnection()
    val serverChannel = connection.createChannel()
    val clientChannel = connection.createChannel()
    serverChannel.queueDeclare(TO_SERVER, false, false, false, null)
    clientChannel.queueDeclare(TO_CLIENT, false, false, false, null)
    serverChannel.basicConsume(TO_SERVER, true, { _: String, delivery: Delivery ->
        val message = String(delivery.body, Charset.forName("UTF-8"))
        println(" [x] Received '$message'")
        clientChannel.basicPublish("", TO_CLIENT, null, " [x] Server has gotten the message: $message".toByteArray())
        println(" [x] Confirmation has been sent")
    }, { consumerTag -> })

    println(" [*] Waiting for messages. To exit press CTRL+C")
}