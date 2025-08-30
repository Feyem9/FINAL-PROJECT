import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Cart } from 'src/interfaces/cart.interface';
import { CartService } from './cart.service';
import { CartDto } from 'src/DTO/cart.dto';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post('add')
    async addToCart(@Body() cartItem: CartDto): Promise<Cart> {
        return this.cartService.addToCart(cartItem);
    }

    @Get()
    async getCartItems(): Promise<Cart[]> {
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
    ): Promise<Cart> {
        return this.cartService.updateCartItem(itemId, quantity);
    }
}
