import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sender_id: number;

    @Column()
    receiver_id: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    currency: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: 'pending' })
    status: 'pending' | 'completed' | 'failed';

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'sender_id' })
    sender: Account;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'receiver_id' })
    receiver: Account;
} 