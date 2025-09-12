import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from 'src/DTO/cart.dto';
import { User } from 'src/interfaces/user.interface';

interface CartResponse {
  userId: string | User;  // accepte un id ou un objet User
  courseId: string;
  courseName: string;
  courseImage: string;
  courseDescription: string;
  quantity: number;
  price: number;
}
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post('add')
    async addToCart(@Body() cartItem: CartDto): Promise<CartResponse> {
        return this.cartService.addToCart(cartItem);
    }

    @Get()
    async getCartItems(): Promise<CartResponse[]> {
        return this.cartService.getCartItems();
    }

    @Delete()
    async clearCart(): Promise<void> {
        await this.cartService.clearCart();
    }

    @Delete(':id')
    async removeFromCart(@Param('id') itemId: string): Promise<void> {
        await this.cartService.removeFromCart(itemId);
    }

    @Patch(':id')
    async updateCartItem(
        @Param('id') itemId: string,
        @Body('quantity') quantity: number,
    ): Promise<CartResponse> {
        return this.cartService.updateCartItem(itemId, quantity);
    }
}
