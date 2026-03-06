import sendEmail from '../utils/sendEmail.js';

class EmailService {
    // Order confirmation email
    async sendOrderConfirmation(order, userEmail) {
        const itemsHtml = order.items
            .map(
                (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">Size ${item.size}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">₹${item.price * item.quantity}</td>
        </tr>
      `
            )
            .join('');

        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 24px; text-align: center;">
          <h1 style="color: #000; margin: 0;">🎉 Order Confirmed!</h1>
        </div>
        <div style="padding: 24px;">
          <p>Thank you for your order! Here's your order summary:</p>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 8px; text-align: left;">Item</th>
                <th style="padding: 8px; text-align: left;">Size</th>
                <th style="padding: 8px; text-align: left;">Qty</th>
                <th style="padding: 8px; text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="border-top: 2px solid #f59e0b; padding-top: 12px; margin-top: 12px;">
            <p>Subtotal: ₹${order.itemsPrice}</p>
            <p>Tax (GST): ₹${order.taxPrice}</p>
            <p>Shipping: ₹${order.shippingPrice}</p>
            <p style="font-size: 18px; font-weight: bold; color: #f59e0b;">Total: ₹${order.totalPrice}</p>
          </div>
          <div style="margin-top: 16px; padding: 12px; background: #f9f9f9; border-radius: 6px;">
            <h3 style="margin: 0 0 8px;">Shipping Address</h3>
            <p style="margin: 0;">${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}</p>
          </div>
        </div>
        <div style="background: #0a0a0a; color: #888; padding: 16px; text-align: center; font-size: 12px;">
          <p>ShoeMart - Step into style</p>
        </div>
      </div>
    `;

        await sendEmail({
            email: userEmail,
            subject: `ShoeMart - Order Confirmed #${order._id}`,
            html,
        });
    }

    // Order status update email
    async sendOrderStatusUpdate(order, userEmail) {
        const statusEmoji = {
            Processing: '📦',
            Confirmed: '✅',
            Shipped: '🚚',
            Delivered: '🎉',
            Cancelled: '❌',
        };

        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="color: #000; margin: 0;">${statusEmoji[order.orderStatus] || '📦'} Order Update</h2>
        </div>
        <div style="padding: 24px; background: #fff;">
          <p>Your order <strong>#${order._id}</strong> status has been updated to:</p>
          <p style="font-size: 24px; font-weight: bold; color: #f59e0b; text-align: center;">${order.orderStatus}</p>
          ${order.trackingNumber ? `<p>Tracking Number: <strong>${order.trackingNumber}</strong></p>` : ''}
        </div>
      </div>
    `;

        await sendEmail({
            email: userEmail,
            subject: `ShoeMart - Order #${order._id} is ${order.orderStatus}`,
            html,
        });
    }
}

export default new EmailService();
