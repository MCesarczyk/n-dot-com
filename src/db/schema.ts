import { relations } from "drizzle-orm"
import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const tweet = pgTable("tweet", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => user.id),
  message: text("message").notNull(),
  retweetCount: integer("retweet_count").notNull().default(0),
  favoriteCount: integer("favorite_count").notNull().default(0),
  isRetweet: boolean("is_retweet").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const userRelations = relations(user, ({ many }) => ({
  tweets: many(tweet),
}))

export const tweetRelations = relations(tweet, ({ one }) => ({
  user: one(user, {
    fields: [tweet.userId],
    references: [user.id],
  }),
}))
