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
        // Check if the same course for the user already exists
        const existingCartItem = await this.cartModel.findOne({
            userId: item.userId,
            courseId: item.courseId,
        }).exec();

        if (existingCartItem) {
            // If exists, update quantity
            existingCartItem.quantity += item.quantity;
            return existingCartItem.save();
        } else {
            // Else create new cart item
            const newItem = new this.cartModel(item);
            return newItem.save();
        }
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
