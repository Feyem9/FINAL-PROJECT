import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartDto } from 'src/DTO/cart.dto';
import { Cart , CartDocument} from 'src/schema/cart.schema';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    ) {}

    async addToCart(item: CartDto): Promise<Cart> {
        const newItem = new this.cartModel(item);
        return newItem.save();
    }

    async getCartItems(): Promise<Cart[]> {
        return this.cartModel.find().exec();
    }

    async clearCart(): Promise<void> {
        await this.cartModel.deleteMany().exec();
    }

    async removeFromCart(itemId: string): Promise<void> {
        await this.cartModel.deleteOne({ _id: itemId }).exec();
    }

    async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
        return this.cartModel.findByIdAndUpdate(itemId, { quantity }, { new: true }).exec();
    }
}
