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
  {
    id: "zara-vincent",
    name: "Zara Vincent",
    location: "Shady Rill Rd, Middlesex",
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
  {
    id: "why-we-need-a-town-administrator",
    authorId: "zara-vincent",
    title: "Why We Need a Town Administrator",
    type: "Discussion",
    date: "2025-01-12",
    link: "https://frontporchforum.com/middlesex/forum/archive/5555?fpf_forum#post_3838915",
    content: `Hi Neighbors,

I wanted to take a moment to explain why Middlesex needs a Town Administrator and some duties they will be expected to perform for you. As I mentioned in my post about volunteers, there are many things Sarah used to handle which are no longer being done because of lack of time and expertise. We need someone to be up to speed on the things this town is legally responsible for doing and the expectations of a municipality or we risk expensive legal action with only a volunteer to deal with it. Lawyer fees later will cost us far more than doing things right the first time.

Furthermore, Middlesex is currently missing out on multiple grants which would help us pay for the things this town needs without hitting your taxes to pay for them. If the Town Administrator could win three 30k grants a year, the position is paid for, their insurance is paid for and there would be additional excess of the money we won from only 3 grants. Hopefully this person can find even more than that, with every penny saving you from having to pay for necessary Town improvements with your taxes.

I have done my best to pick up on the awesome communication Sarah used to give us. Writing these posts are time consuming, but we need more information not less. When we are informed, there is less of a chance for misinformation being spread through idol gossip. People don't tend to read the minutes of committees or watch the ORCA videos of our select board meetings on YouTube. In the 21st century we all wish to be fed information, not to look for it. The Town Administrator could do a weekly post informing everyone of what the various committees are doing to work towards the embitterment of this town.

There are many other duties that this employee can and will take on, but I think those three: Municipal expertise, Grant finding and writing, and town wide communication are enough to warrant the position. Relying on volunteers is an unreasonable and unsustainable expectation.

Lastly for those who are already spreading misinformation about this role – yes, I did offer to take 25K+ LESS than I normally make to potentially do this job as I have been the one doing communication, grant finding and writing. (with a great deal of help from CVRPC and Sandy Levine from our own Planning Commission). However, I may not be available by the time July rolls around and frankly, I would rather we found someone with more municipal expertise than I have gleaned in my 2.5 years of volunteering for Middlesex. I am not, as it has been suggested, "making a position for myself." I don't need it, nor the negativity of folks who are uninformed of the facts.

I truly hope this person can bring a fresh perspective and a dose of positivity Middlesex both needs and deserves.

For all those reasons and more, I will be voting to move forward in adding this position which is desperately needed for the embitterment of Middlesex and all of us who live here.`,
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
