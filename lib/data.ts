export interface Author {
  id: string;
  name: string;
  location: string;
  role?: string;
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  type: "Announcement" | "Discussion" | "Update" | "Question";
  date: string;
  content: string;
  link?: string;
}

export const authors: Author[] = [
  {
    id: "mark-martha-harris",
    name: "Mark and Martha Harris",
    location: "Upper Sunny Brook Rd, Middlesex",
    role: "Budget Committee Chair",
  },
];

export const posts: Post[] = [
  {
    id: "budget-anxiety-season-2025",
    authorId: "mark-martha-harris",
    title: "Town Budget Anxiety Season",
    type: "Announcement",
    date: "2025-01-11",
    link: "https://frontporchforum.com/middlesex/forum/archive/5551#post_3836144",
    content: `Hi folks,

Well, it's that time of year again, when anxiety rises about next year's budget increase, and what it will mean for our property tax bills.

The Budget Committee and Select Board are closing in on a budget for Fiscal Year 2027.

We already know that the Education portion of our tax bills is estimated to rise another 12% (!), but fortunately, the Scott Administration has decided to buy the increase down, using a General Fund surplus, to more palatable 7%. A nice gesture, but an unsustainable solution year over year.

That leaves us with the Municipal Tax portion of the bill, determined by our town budget.

Here's a snapshot of our town budget increases over the past 10 years, to provide some context:
- Increases have ranged between 2.06% and 11.45%
- Over the past 4 years, increases have ranged from 8.73% to 11.36%

Some more context:
- Up until the Pandemic, we were doing pretty well with budgeting. Then the inflation spike happened, and prices started rising
- Then the 2023/24 floods hit, which devastated our town's finances. We're still suffering the brunt of those impacts today, as we have outstanding loan costs baked into our budget.

I think it's safe to say our budgeting in the past has mostly been reactionary – we get unforeseen cost spikes and then sharpen our pencils and cut in other areas to reduce the overall increase as much as possible.

The exception to this approach, most recently, was in the FY 2025 budget (an 11.36% increase), where we thought strategically about Capital asset replacement, and created annual funding. This funding alone represented 35% of the overall FY 2025 budget increase, but it was felt that we had to plan, and fund, for the future.

We're at a similar strategic crossroad now. We've been generally reactionary about budgeting, as described above. Is it time to adjust our thinking in a proactive direction?

One way to do this is by thinking about how best we'd like our town to support us as citizens, what services we'd like provided to us, and determine what the cost of that model would look like. To pay for the cost, we'd hopefully find additional funding mechanisms than the sole reliance on property taxes.

It's something to consider, because the current trend isn't working for all of our citizens.

We'd like to share with folks the thinking behind our budget increase, whatever it becomes, in this forum, on a regular basis, until Town Meeting Day, so we can have a more informed conversation about the budget at that time.

To that end, some posts might include:
- What does a Town Administrator do, and why do we need one?
- What are the main cost drivers of the budget increase?
- What does this increase mean $ wise for our tax bills?

Thanks for reading.

I'm happy to answer any questions you might have. If I can't, I'll direct them to someone who can.

**Mark Harris**
*Budget Committee Chair*`,
  },
];

export function getAuthor(authorId: string): Author | undefined {
  return authors.find((a) => a.id === authorId);
}

export function getPostsWithAuthors(): (Post & { author: Author })[] {
  return posts.map((post) => ({
    ...post,
    author: getAuthor(post.authorId)!,
  }));
}
